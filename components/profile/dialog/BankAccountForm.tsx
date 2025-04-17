"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AccountType, PreferredMode } from "@prisma/client";
import { usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { submitPaymentDetailsForm } from "@/lib/actions/submitPaymentDetailsForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  name: string | null;
  accountNumber: string | null;
  ifsc: string | null;
  accountType: string | null;
}

const BankAccountForm = ({ name, accountNumber, accountType, ifsc }: Props) => {
  const pathname = usePathname();

  const initialState = {
    message: "",
  };

  const InputBox = () => {
    const { pending } = useFormStatus();

    <div className="space-y-1">
      <Input aria-disabled={pending} disabled={pending} required autoFocus />
    </div>;

    return (
      <>
        <div className="space-y-1">
          <Label htmlFor="name">Account type</Label>
          <Select defaultValue={accountType || ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AccountType.savings} className="capitalize">
                {AccountType.savings}
              </SelectItem>
              <SelectItem value={AccountType.current} className="capitalize">
                {AccountType.current}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="name">Name on account</Label>
          <Input
            id="name"
            name="name"
            type="string"
            aria-disabled={pending}
            disabled={pending}
            required
            autoFocus
            defaultValue={name || ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="accountNumber">Account number</Label>
          <Input
            id="accountNumber"
            name="accountNumber"
            type="string"
            aria-disabled={pending}
            disabled={pending}
            required
            defaultValue={accountNumber || ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="ifsc">IFSC code</Label>
          <Input
            id="ifsc"
            name="ifsc"
            type="string"
            aria-disabled={pending}
            disabled={pending}
            required
            defaultValue={ifsc || ""}
          />
        </div>
      </>
    );
  };

  const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        type="submit"
        disabled={pending}
        loading={pending}
        aria-disabled={pending}
      >
        Save changes
      </Button>
    );
  };

  const [state, formAction] = useFormState(
    submitPaymentDetailsForm,
    initialState
  );

  return (
    <TabsContent value={PreferredMode.bank} asChild>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="preferredMode" value={PreferredMode.bank} />
        <input type="hidden" name="pathname" value={pathname} />

        <Card>
          <CardHeader>
            <CardTitle>Account information</CardTitle>
            <CardDescription>
              Please enter your Name, Account number, and IFSC code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <InputBox />
          </CardContent>
          <CardFooter className="justify-end">
            <SubmitButton />
          </CardFooter>
        </Card>

        {!!state.message && (
          <Alert className="w-[calc(100%-16px)] mx-auto m-2" variant="info">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </TabsContent>
  );
};

export default BankAccountForm;
