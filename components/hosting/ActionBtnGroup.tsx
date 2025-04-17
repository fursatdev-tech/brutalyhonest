import { ActionCategories, ActionTypes, MessageActions } from "@prisma/client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { showError } from "@/util/catchError";
import axios from "axios";
import { actionClickHandler } from "@/util/routes";
import { toast } from "@/components/ui/use-toast";

interface Props {
  actions: MessageActions[];
  actionCategory: ActionCategories;
  reservationId?: string;
  threadId: string;
  text: string;
}

const ActionBtnGroup = ({
  actions,
  actionCategory,
  reservationId,
  threadId,
  text,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const onActionClick = async (action: MessageActions) => {
    setLoading(true);

    try {
      const res = await axios.post(actionClickHandler, {
        action: action.type,
        actionCategory,
        reservationId,
        threadId,
        text,
        ...params,
      });

      router.refresh();

      const message = res.data;
      toast({
        title: message,
        duration: 3000,
      });
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 justify-end items-center">
      {actions.map((action, i) => (
        <Button
          key={i}
          size="sm"
          disabled={loading}
          loading={loading}
          variant={
            action.type === ActionTypes.btnAccept ? "default" : "outline"
          }
          onClick={() => onActionClick(action)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default ActionBtnGroup;
