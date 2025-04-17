import { Button } from "@/components/ui/button";

import PaymentDetails from "@/components/profile/dialog/PaymentDetails";

const HostAccountValidator = () => {
  // const [loading, setLoading] = useState(false);
  // const router = useRouter();

  // const connectStripeAccount = async () => {
  //   setLoading(true);

  //   const { url, error } = await connectStripeAccountAction();

  //   if (url) return router.push(url);

  //   setLoading(false);

  //   showError({
  //     message: error || "Unexpected error occured!!! Please contact support.",
  //   });
  // };

  return (
    // <div className="flex items-center ga-2 md:gap-6 bg-red-100 justify-center px-6 text-sm flex-wrap text-center pt-2 md:pt-0">
    //   <p className="font-semibold">
    //     Connect your stripe account for automatic payouts after booking
    //   </p>

    //   <Button
    //     variant="link"
    //     className="text-primary underline"
    //     onClick={connectStripeAccount}
    //     disabled={loading}
    //     loading={loading}
    //   >
    //     Connect Stripe Account
    //   </Button>
    // </div>

    <div className="flex items-center ga-2 md:gap-6 bg-primary-lightest justify-center px-6 text-sm flex-wrap text-center pt-2 md:pt-0">
      <p className="font-semibold">
        Enter your account details for automatic payouts after booking
      </p>

      <PaymentDetails>
        <Button variant="link" className="underline text-foreground">
          Update now
        </Button>
      </PaymentDetails>
    </div>
  );
};

export default HostAccountValidator;
