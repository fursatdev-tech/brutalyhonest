"use client";

import { format } from "date-fns";
import { UserRole } from "@prisma/client";

import { SafeMessage, SafeThread } from "@/util/types";
import NoThread from "@/components/hosting/NoThread";
import ChatThread from "@/components/hosting/ChatThread";
import { Skeleton } from "@/components/ui/skeleton";
import MessageInput from "@/components/hosting/MessageInput";

interface Props {
  message?: SafeMessage;
  thread?: SafeThread[];
  role: UserRole;
}

const Conversation = ({ message, thread, role }: Props) => {
  const headerText =
    role === UserRole.guest
      ? message?.listing?.host?.name
      : message?.reservation?.user.name;

  return (
    <div className="flex flex-col space-y-4 h-[calc(100vh-120px)]">
      {message ? (
        <div className="space-y-3 divide-y border-b pb-4">
          <p className="font-bold text-xl">{headerText}</p>
          <div className="text-sm">
            <p className="font-semibold mt-3">{message.listing.title}</p>
            <p className="text-xs text-muted-foreground flex gap-2">
              <span>
                {format(new Date(message.reservation?.startDate), "dd LLL")} -{" "}
                {format(new Date(message.reservation?.endDate), "dd LLL")}{" "}
                {format(new Date(message.reservation?.endDate), "yyyy")}
              </span>
              &#x22C5;
              <span>${message.reservation.totalPrice.toLocaleString()}</span>
              &#x22C5;
              <span>
                {(message.reservation?.adults || 1) +
                  (message.reservation?.children || 0)}{" "}
                guests
              </span>
              {!!message.reservation?.infants && (
                <>
                  &#x22C5;
                  <span>{message.reservation.infants} infants</span>
                </>
              )}
              {!!message.reservation?.pets && (
                <>
                  &#x22C5;
                  <span>{message.reservation.pets} pets</span>
                </>
              )}
            </p>
          </div>
        </div>
      ) : (
        <Skeleton className="h-8 w-96" />
      )}

      <div className="md:max-w-2xl m-auto flex-1 overflow-y-auto">
        {thread ? (
          <ChatThread
            thread={thread}
            reservationId={message?.reservationId}
            role={role}
          />
        ) : (
          <NoThread />
        )}
      </div>

      {!!thread?.length && (
        <MessageInput
          role={role}
          messageId={message?.id}
          className="md:max-w-2xl m-auto"
          reservationId={message?.reservationId}
        />
      )}
    </div>
  );
};

export default Conversation;
