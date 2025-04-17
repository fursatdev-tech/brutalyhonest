"use client";

import { useEffect, useState } from "react";
import { Price } from "@prisma/client";

import { ListingReservationProps } from "@/components/listings/details/details.props";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Booking from "@/components/listings/details/popovers/Booking";
import ReserveFooter from "@/components/listings/details/ReserveFooter";
import { parseAsInteger, parseAsTimestamp, useQueryStates } from "nuqs";
import DateError from "./DateError";
import { getCookieVal } from "@/lib/actions/getConvertedPrice";

const ListingReservation = ({
    originalPrice,
    pgOriginalPrice,
    ...props
}: ListingReservationProps) => {
    const [booking, setBooking] = useQueryStates({
        from: parseAsTimestamp,
        to: parseAsTimestamp,
        nights: parseAsInteger.withDefault(0),
    });
    const [dateError, setDateError] = useState(false);
    const [datePopover, setDatePopover] = useState(false);

    const { nights, from, to } = booking;

    const { maxNights, minNights } = props;

    const [conversion, setConversion] = useState({
        price: parseInt(originalPrice.inr),
        symbol: "₹",
        pgOriginalPrice: parseInt(pgOriginalPrice?.inr || "0"),
        currency: "inr",
    });

    useEffect(() => {
        convertedPrice();

        if (
            from &&
            to &&
            maxNights &&
            minNights &&
            (nights > maxNights || nights < minNights)
        )
            return setDateError(true);

        return setDateError(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nights]);

    const convertedPrice = async () => {
        const currency = await getCookieVal();

        const symbol = currency === "usd" ? "$" : "₹";

        const __price = parseInt(originalPrice[currency as keyof Price] || "0");
        const __pgOriginalPrice = parseInt(
            (pgOriginalPrice && pgOriginalPrice[currency as keyof Price]) || "0"
        );

        setConversion({
            price: __price,
            symbol,
            pgOriginalPrice: __pgOriginalPrice,
            currency,
        });
    };

    return (
        <Card className="md:top-28 md:sticky shadow-2xl rounded-2xl">
            <CardHeader>
                <CardTitle className="flex items-end gap-1">
                    <p>
                        {conversion.symbol} {conversion.price.toLocaleString()}
                    </p>
                    <p className="font-light text-muted text-sm">night</p>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <Booking
                    {...props}
                    dateError={dateError}
                    datePopover={datePopover}
                    setDatePopover={setDatePopover}
                />
                {dateError && <DateError className="ms-1" />}
            </CardContent>
            <CardFooter>
                {from && to ? (
                    <ReserveFooter
                        image={props.imageUrl}
                        conversion={conversion}
                        nights={nights}
                        title={props.title}
                        listingId={props.id}
                        startDate={from}
                        endDate={to}
                        perGuestPricing={props.perGuestPricing}
                        guests={props.guests}
                        status={props.status}
                        minNights={minNights}
                        maxNights={maxNights}
                        allowFreeStay={props.allowFreeStay}
                    />
                ) : (
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={() => setDatePopover(true)}
                    >
                        Check availability
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default ListingReservation;
