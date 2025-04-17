import axios from "axios";
import Stripe from "stripe";

import getStripe from "@/lib/actions/getStripe";
import { showError } from "@/util/catchError";
import { checkoutSession } from "@/util/routes";
import { toast } from "@/components/ui/use-toast";

interface Props {
  title: string;
  image: string;
  totalPrice: number;
  listingId: string;
  startDate: Date;
  endDate: Date;
  setLoading: (loading: boolean) => void;
  adults?: number;
  children?: number;
  infants?: number;
  pets?: number;
  minNights: number | null;
  maxNights?: number | null;
  nights?: number;
  priceBreakup?: {
    basePrice: number;
    extraGuestCharges: number;
    transactionFee: number;
    tax: number;
  };
  allowFreeStay?: boolean;
  currency?: string;
}

const initStripeCheckout = async ({
  currency,
  title,
  image,
  totalPrice,
  listingId,
  startDate,
  endDate,
  setLoading,
  adults,
  children,
  infants,
  pets,
  minNights,
  maxNights,
  nights,
  priceBreakup,
  allowFreeStay = true,
}: Props) => {
  setLoading(true);

  try {
    const response = await axios.post(checkoutSession, {
      amount: totalPrice * 100,
      name: title,
      cancel_url: window.location.href,
      images: [image],
      adults,
      children,
      infants,
      pets,
      minNights,
      maxNights,
      nights,
      priceBreakup,
      allowFreeStay,
      currency,
      metaData: {
        listingId,
        startDate,
        endDate,
        totalPrice,
      },
    });

    const data = await response.data;

    if (data.booked) {
      toast({
        title: "Booking Successful",
        description: "Your request was sent to host for approval.",
        duration: 5000,
      });

      return (window.location.href = "/my-trips");
    }

    const stripe = await getStripe();

    const sessionData: Stripe.Checkout.Session = data;

    await stripe!.redirectToCheckout({
      sessionId: sessionData.id,
    });
  } catch (error: any) {
    showError(error);
  } finally {
    setLoading(false);
  }
};

export default initStripeCheckout;
