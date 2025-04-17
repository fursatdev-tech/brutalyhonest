"use client";

import { ActionCategories, MessageActions, UserRole } from "@prisma/client";
import { BsExclamationCircle } from "react-icons/bs";
import useSWR from "swr";

import ActionBtnGroup from "@/components/hosting/ActionBtnGroup";
import { cn } from "@/lib/utils";
import { fetcher } from "@/components/tours/survey-form-steps/common.props";
import { getSocialNetworks } from "@/util/routes";
import ShowSocialMediaLinks, {
  SocialProps,
} from "@/components/hosting/ShowSocialMediaLinks";

interface Props {
  text: string;
  actionCategory: ActionCategories;
  actions: MessageActions[];
  isUnread: boolean;
  reservationId?: string;
  threadId: string;
  role: UserRole;
}

const ShowSystemMessage = ({
  text,
  actions,
  actionCategory,
  isUnread,
  reservationId,
  threadId,
  role,
}: Props) => {
  const { data, isLoading } = useSWR(
    getSocialNetworks(reservationId ?? "", text),
    fetcher
  );

  if (actionCategory === ActionCategories.none)
    return (
      <div className="rounded-full py-2 px-6 border-2 bg-gray-50 flex flex-coShowSocialMediaLinksl gap-2 text-xs">
        <p className={cn("flex items-center gap-2")}>
          <BsExclamationCircle size={16} /> {text}
        </p>
      </div>
    );

  if (actionCategory === ActionCategories.approval)
    return (
      <div
        className={cn(
          "rounded-full py-2 px-6 border-2 bg-gray-50 text-xs flex flex-col gap-2",
          isUnread && "px-10 py-4 rounded-xl text-sm font-semibold"
        )}
      >
        <p className={cn("flex items-center gap-2")}>
          <BsExclamationCircle size={16} /> {text}
        </p>

        {data?.data && <ShowSocialMediaLinks data={data.data} />}

        {role === UserRole.host && isUnread && (
          <ActionBtnGroup
            actions={actions}
            actionCategory={actionCategory}
            reservationId={reservationId}
            threadId={threadId}
            text={text}
          />
        )}
      </div>
    );
};

export default ShowSystemMessage;
