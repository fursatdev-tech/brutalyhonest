import { UserRole } from "@prisma/client";
import { ElementRef, useEffect, useRef } from "react";

import ShowSystemMessage from "@/components/hosting/ShowSystemMessage";
import { SafeThread } from "@/util/types";
import ShowUserMessage from "@/components/hosting/ShowUserMessage";
import AiLoader from "@/components/hosting/AiLoader";

interface Props {
  reservationId?: string;
  thread?: SafeThread[];
  role: UserRole;
  isLoading?: boolean;
}

const ChatThread = ({ thread = [], reservationId, role, isLoading }: Props) => {
  const scrollRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.length, isLoading]);

  return (
    <div>
      <div className="pr-4 space-y-8 md:min-w-[600px]">
        {thread.map((data, i) => {
          const isSystem = data.role === UserRole.system;

          return isSystem ? (
            <ShowSystemMessage
              key={i}
              text={data.text!}
              actionCategory={data.actionCategory}
              actions={data.actions}
              isUnread={data.isUnread}
              reservationId={reservationId}
              threadId={data.id}
              role={role}
            />
          ) : (
            <ShowUserMessage key={i} data={data} />
          );
        })}

        {isLoading && <AiLoader />}

        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default ChatThread;
