"use server";

import { PreferredMode } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpiForm from "@/components/profile/dialog/UpiForm";
import BankAccountForm from "@/components/profile/dialog/BankAccountForm";
import { getAccountData } from "@/lib/actions/getHostStripeAccount";
import PaypalForm from "@/components/profile/dialog/PaypalForm";

interface Props {
  children: React.ReactNode;
}

const PaymentDetails = async ({ children }: Props) => {
  const initialState = await getAccountData();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription asChild>
            <div className="mx-auto overflow-y-auto space-y-8">
              <h2 className="text-foreground">Payment Details</h2>

              <div className="space-y-2">
                <p className="text-foreground font-bold">
                  Select preferred payout method
                </p>

                <Tabs
                  defaultValue={initialState.preferredMode || PreferredMode.vpa}
                  className="w-full md:w-96"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value={PreferredMode.vpa}>UPI</TabsTrigger>
                    <TabsTrigger value={PreferredMode.bank}>
                      Bank account
                    </TabsTrigger>
                    <TabsTrigger value={PreferredMode.paypal}>
                      Paypal
                    </TabsTrigger>
                  </TabsList>

                  <UpiForm
                    upi={initialState.upi}
                    accountType={initialState.accountType}
                  />
                  <BankAccountForm
                    name={initialState.name}
                    accountNumber={initialState.accountNumber}
                    ifsc={initialState.ifsc}
                    accountType={initialState.accountType}
                  />
                  <PaypalForm
                    paypal={initialState.paypal}
                    accountType={initialState.accountType}
                  />
                </Tabs>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetails;
