import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cancelMyReservation } from "@/util/routes";
import { showError } from "@/util/catchError";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Props {
  reservationId: string;
  onOpen: boolean;
  setOnOpen: (value: boolean) => void;
}

const ConfirmCancellation = ({ reservationId, onOpen, setOnOpen }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(cancelMyReservation(reservationId));

      const { message } = res.data;

      toast({
        title: "Success",
        description: message,
      });
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
      setOnOpen(false);
      router.refresh();
    }
  };

  return (
    <AlertDialog open={onOpen} onOpenChange={setOnOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently cancel your
            reservation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              loading={loading}
              disabled={loading}
            >
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmCancellation;
