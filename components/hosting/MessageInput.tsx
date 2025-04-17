"use client";

import { LuSendHorizonal } from "react-icons/lu";
import { UserRole } from "@prisma/client";
import { useFormState, useFormStatus } from "react-dom";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getAIresponse } from "@/lib/actions/getAIresponse";
import { useEffect, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  role: UserRole;
  className?: string;
  messageId: string | undefined;
  reservationId: string | undefined;
}

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      loading={pending}
      aria-disabled={pending}
      variant="ghost"
    >
      <LuSendHorizonal className="w-6 h-6" />
    </Button>
  );
};

const InputBox = () => {
  const { pending, data } = useFormStatus();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!data && inputRef.current) inputRef.current.value = "";
  }, [data]);

  return (
    <Input
      aria-disabled={pending}
      disabled={pending}
      placeholder="Type a message"
      id="prompt"
      name="prompt"
      ref={inputRef}
      required
    />
  );
};

const MessageInput = ({ role, className, messageId, reservationId }: Props) => {
  const initialState = {
    message: "",
  };

  const [state, formAction] = useFormState(getAIresponse, initialState);

  return (
    <>
      {!!state.message && state.message !== "done" && (
        <Alert className="max-w-2xl mx-auto">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <form
        action={formAction}
        className={cn(
          "border-t bg-background py-4 fixed md:relative bottom-0 flex items-center gap-x-2 w-[calc(100vw-24px)] md:w-full",
          className
        )}
      >
        {/* <LuImagePlus size={24} /> */}
        <input type="hidden" name="reservationId" value={reservationId} />
        <input type="hidden" name="messageId" value={messageId} />
        <input type="hidden" name="role" value={role} />

        <InputBox />
        <SubmitButton />
      </form>
    </>
  );
};

export default MessageInput;
