import MessagesThread from "@/components/hosting/MessagesThread";
import getMessages from "@/lib/actions/getMessages";
import { UserRole } from "@prisma/client";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const HostingInboxLayout = async (props: Props) => {
  const role = UserRole.guest;

  const messages = await getMessages(role);

  return (
    <div className="grid grid-cols-12 divide-x space-y-3">
      <div className="col-span-3 space-y-6 px-4">
        <h1 className="font-bold !text-2xl">All messages</h1>
        <MessagesThread messages={messages} role={role} />
      </div>

      <div className="col-span-9 px-3 divide-y space-y-4">{props.children}</div>
    </div>
  );
};

export default HostingInboxLayout;
