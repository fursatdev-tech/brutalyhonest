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

interface Props {
  upi: string | null;
  accountType: string | null;
}

const UpiForm = ({ upi, accountType }: Props) => {
  const pathname = usePathname();

  const initialState = {
    message: "",
  };

  const InputBox = () => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-1">
        <Input
          id="upi"
          name="upi"
          placeholder="Enter UPI ID"
          aria-disabled={pending}
          disabled={pending}
          required
          autoFocus
          defaultValue={upi || ""}
        />
      </div>
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
    <TabsContent value={PreferredMode.vpa} asChild>
      <form action={formAction} className="space-y-4">
        <input
          type="hidden"
          name="accountType"
          value={accountType || AccountType.savings}
        />
        <input type="hidden" name="preferredMode" value={PreferredMode.vpa} />
        <input type="hidden" name="pathname" value={pathname} />

        <Card>
          <CardHeader>
            <CardTitle>UPI Apps</CardTitle>
            <CardDescription>Please enter your UPI ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <InputBox />
          </CardContent>
          <CardFooter className="justify-end">
            <SubmitButton />
          </CardFooter>
        </Card>

        {!!state.message && (
          <Alert className="mx-auto" variant="info">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </TabsContent>
  );
};

export default UpiForm;
