"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Stripe from "stripe";
import { PriceEnum } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { tourCheckoutSessions } from "@/lib/actions/tourCheckoutSessions";
import { showError } from "@/util/catchError";
import getStripe from "@/lib/actions/getStripe";
import { useUser, useClerk } from "@clerk/nextjs";

interface Props {
  startDate: Date;
  endDate: Date;
  subtitle: string;
  tax: number;
  total: number;
  name: string;
  tourId: string;
  images: string[];
  basePrice: number;
  transactionFee: number;
  currency: PriceEnum;
  guestCount: number;

}

export default function BookPackage({
  startDate,
  endDate,
  subtitle,
  tax,
  total,
  name,
  tourId,
  images,
  basePrice,
  transactionFee,
  currency,
  guestCount,
}: Props) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useUser(); // Check if user is signed in
  const { redirectToSignUp } = useClerk(); // Clerk signup handler

  const bookTrip = async () => {
    if (!isSignedIn) {
      // Redirect to signup if not signed in
      return redirectToSignUp({
        afterSignInUrl: pathname,
        afterSignUpUrl: pathname,
      });
    }

    setLoading(true);
    const { data, error } = await tourCheckoutSessions({
      amount: total,
      name,
      metaData: {
        tourId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: total,
      },
      images,
      description: subtitle,
      priceBreakup: {
        basePrice,
        transactionFee,
        tax,
      },
      cancel_url: pathname,
      currency,
    });
    setLoading(false);
    if (error || !data) return showError({ message: error });
    const stripe = await getStripe();
    const sessionData: Stripe.Checkout.Session = data;
    await stripe!.redirectToCheckout({
      sessionId: sessionData.id,
    });
  };

  return (
    <Button
      className="w-full"
      onClick={bookTrip}
      loading={loading}
      disabled={loading}
    >
      Book this trip
    </Button>
  );
}