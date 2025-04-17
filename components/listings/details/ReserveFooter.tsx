import { useCallback, useEffect, useMemo, useState } from "react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { parseAsInteger, useQueryStates } from "nuqs";
import { ListingStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import initStripeCheckout from "@/lib/useStripeCheckout";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { checkInfluencerSocials } from "@/lib/actions/checkInfluencerSocials";

interface PageProps {
    conversion: {
        price: number;
        symbol: string;
        pgOriginalPrice: number;
        currency: string;
    };
    nights: number;
    title: string;
    listingId: string;
    startDate: Date;
    endDate: Date;
    image: string;
    perGuestPricing: boolean;
    guests: number;
    status: ListingStatus;
    minNights: number | null;
    maxNights: number | null;
    allowFreeStay: boolean;
}

const ReserveFooter = ({
    conversion,
    nights,
    title,
    listingId,
    startDate,
    endDate,
    image,
    guests,
    status,
    minNights,
    maxNights,
    allowFreeStay,
}: PageProps) => {
    const [loading, setLoading] = useState(false);
    const [isEligibleForFreeHosting, setIsEligibleForFreeHosting] =
        useState(false);

    const [guestData, setAdults] = useQueryStates({
        adults: parseAsInteger.withDefault(1),
        children: parseAsInteger.withDefault(0),
        infants: parseAsInteger.withDefault(0),
        pets: parseAsInteger.withDefault(0),
    });

    const { adults, children, infants, pets } = guestData;

    const overCharge = Math.max(
        0,
        (adults + children - guests) * conversion.pgOriginalPrice * nights
    );

    const basePrice = conversion.price * nights;

    const subTotalPriceBeforeFee = basePrice + overCharge;

    const transactionChargePer =
        parseInt(process.env.NEXT_PUBLIC_TRANSACTION_CHARGES_PER || "5") / 100;

    const transactionCharges = Math.round(
        subTotalPriceBeforeFee * transactionChargePer
    );

    const subTotalPrice = basePrice + overCharge + transactionCharges;

    const subTotalString = subTotalPrice.toLocaleString();

    const pricePerGuestPerNight = subTotalPrice / (nights * guests);

    const gstPercentage = pricePerGuestPerNight > 7500 ? 0.18 : 0.12;

    const gst = Math.round(subTotalPrice * gstPercentage);

    const totalPrice = subTotalPrice + gst;

    const totalString = totalPrice.toLocaleString();

    useEffect(() => {
        if (!allowFreeStay) return setIsEligibleForFreeHosting(false);

        checkInfluencerSocials().then(setIsEligibleForFreeHosting);
    }, [allowFreeStay]);

    const priceBreakup = useMemo(() => {
        return {
            basePrice,
            tax: gst,
            extraGuestCharges: overCharge,
            transactionFee: transactionCharges,
        };
    }, [basePrice, overCharge, transactionCharges, gst]);

    const currency = conversion.currency;

    const reserve = useCallback(
        async () =>
            await initStripeCheckout({
                currency,
                title,
                image,
                listingId,
                startDate,
                endDate,
                totalPrice,
                setLoading,
                adults,
                children,
                infants,
                pets,
                minNights,
                maxNights,
                nights,
                priceBreakup,
                allowFreeStay,
            }),
        [
            currency,
            title,
            image,
            listingId,
            startDate,
            endDate,
            totalPrice,
            adults,
            children,
            infants,
            pets,
            minNights,
            maxNights,
            nights,
            priceBreakup,
            allowFreeStay,
        ]
    );

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-4">
                <SignedIn>
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={reserve}
                        disabled={loading || status === ListingStatus.draft}
                        loading={loading}
                    >
                        Request to book
                    </Button>
                </SignedIn>

                <SignedOut>
                    <SignInButton
                        mode="modal"
                        forceRedirectUrl={window?.location?.href}
                    >
                        <Button
                            size="lg"
                            className="w-full"
                            disabled={loading || status === ListingStatus.draft}
                        >
                            Request to book
                        </Button>
                    </SignInButton>
                </SignedOut>

                <p className="font-light text-center text-secondary-foreground text-sm">
                    You won&apos;t be charged yet
                </p>
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <div className="flex justify-between font-light text-secondary-foreground cursor-pointer">
                        <p className="underline">
                            {conversion.symbol}
                            {conversion.price.toLocaleString()} x {nights}{" "}
                            nights
                        </p>
                        <p>
                            {conversion.symbol}
                            {totalString}
                        </p>
                    </div>
                </PopoverTrigger>
                <PopoverContent align="start" className="text-sm">
                    <div className="space-y-3">
                        <p className="flex justify-between items-center gap-4 font-light text-secondary-foreground">
                            <span>
                                {conversion.symbol}
                                {conversion.price.toLocaleString()} x {nights}{" "}
                                nights
                            </span>
                            <span className="font-bold">
                                {conversion.symbol}
                                {(conversion.price * nights).toLocaleString()}
                            </span>
                        </p>

                        {!!(overCharge > 0) && (
                            <p className="flex justify-between items-center gap-4 font-light text-secondary-foreground">
                                <span>
                                    {conversion.symbol}
                                    {conversion.pgOriginalPrice.toLocaleString()}{" "}
                                    x {adults + children - guests} guests x{" "}
                                    {nights} nights
                                </span>
                                <span className="font-bold">
                                    {conversion.symbol}
                                    {overCharge.toLocaleString()}
                                </span>
                            </p>
                        )}

                        <p className="flex justify-between items-center gap-4 font-light text-secondary-foreground">
                            <span>Transaction charges</span>
                            <span className="font-bold">
                                {conversion.symbol}
                                {transactionCharges.toLocaleString()}
                            </span>
                        </p>

                        <Separator />

                        <p className="flex justify-between items-center gap-4 font-light text-secondary-foreground">
                            <span>Subtotal</span>
                            <span className="font-bold">
                                {conversion.symbol}
                                {subTotalString}
                            </span>
                        </p>

                        <p className="flex justify-between items-center gap-4 font-light text-secondary-foreground">
                            <span>GST</span>
                            <span className="font-bold">
                                {conversion.symbol}
                                {gst.toLocaleString()}
                            </span>
                        </p>
                        <Separator />
                        <p className="flex justify-between items-center gap-4 font-light text-secondary-foreground">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">
                                {conversion.symbol}
                                {totalString}
                            </span>
                        </p>
                    </div>
                </PopoverContent>
            </Popover>

            <Separator />

            <div>
                <div className="flex justify-between font-bold">
                    <p>Price with taxes</p>

                    {isEligibleForFreeHosting ? (
                        <p>
                            <span className="text-muted-foreground line-through">
                                {conversion.symbol}
                                {totalString}
                            </span>{" "}
                            Free
                        </p>
                    ) : (
                        <p>
                            {conversion.symbol}
                            {totalString}
                        </p>
                    )}
                </div>
                {!isEligibleForFreeHosting && (
                    <p className="text-right text-muted-foreground text-xs">
                        includes {conversion.symbol}
                        {transactionCharges.toLocaleString()} transaction
                        charges and {conversion.symbol}
                        {gst} GST
                    </p>
                )}
            </div>
        </div>
    );
};

export default ReserveFooter;
