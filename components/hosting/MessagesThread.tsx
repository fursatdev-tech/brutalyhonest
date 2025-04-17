"use client";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import { useMediaQuery } from "usehooks-ts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SafeMessage } from "@/util/types";

interface Props {
  messages: SafeMessage[];
  role: UserRole;
}

const MessagesThread = ({ messages, role }: Props) => {
  const params = useParams();
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const messageId = params?.messageId;

  const getImageSrc = (message: SafeMessage) => {
    if (role === UserRole.host) return message?.reservation?.user?.image;

    return message?.listing?.host?.profilePhotoUrl;
  };

  const getDisplayName = (message: SafeMessage) => {
    if (role === UserRole.host) return message?.reservation?.user?.name;

    return message?.listing?.host?.name;
  };

  const navigate = (message: SafeMessage) => {
    if (role === UserRole.host)
      return router.push(`/hosting/inbox/${message.id}`);

    router.push(`/messages/${message.id}`);
  };

  return (
    <>
      {(isDesktop || !messageId) && (
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="divide-y space-y-3">
            {messages.map((message, i) => (
              <div
                className={cn(
                  "flex items-center gap-3 p-4 transition duration-300 ease-in-out cursor-pointer hover:bg-gray-100 rounded-xl",
                  message.id === messageId && "bg-gray-100"
                )}
                key={i}
                onClick={() => navigate(message)}
              >
                <Avatar>
                  <AvatarImage
                    src={
                      getImageSrc(message) || "https://github.com/shadcn.png"
                    }
                    alt="message"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm">{getDisplayName(message)}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(message.reservation?.startDate), "dd LLL")}{" "}
                    - {format(new Date(message.reservation?.endDate), "dd LLL")}{" "}
                    {format(new Date(message.reservation?.endDate), "yyyy")}
                  </p>
                  <p className="text-xs font-light text-muted-foreground">
                    {message?.listing?.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </>
  );
};

export default MessagesThread;
