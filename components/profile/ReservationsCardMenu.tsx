import { FaEllipsisVertical } from "react-icons/fa6";
import { useState } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import ConfirmCancellation from "@/components/profile/dialog/ConfirmCancellation";
import { PaymentStatus, ReservationStatus } from "@prisma/client";

interface Props {
  reservationId: string;
  status: string;
  paymentStatus: string;
}

const ReservationsCardMenu = ({
  reservationId,
  status,
  paymentStatus,
}: Props) => {
  const [onOpen, setOnOpen] = useState(false);

  const isDisabled = (): boolean => {
    if (
      status === ReservationStatus.completed ||
      status === ReservationStatus.canceled ||
      status === ReservationStatus.rejected ||
      paymentStatus === PaymentStatus.refunded
    )
      return true;

    if (paymentStatus !== PaymentStatus.succeeded) return true;

    return false;
  };

  return (
    <>
      <Menubar className="border-none ring-0 h-fit">
        <MenubarMenu>
          <MenubarTrigger asChild className="p-1 cursor-pointer">
            <span>
              <FaEllipsisVertical size="18" className="text-primary" />
            </span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled={isDisabled()}>
              <p className="w-full" onClick={() => setOnOpen(true)}>
                Cancel
              </p>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <ConfirmCancellation
        reservationId={reservationId}
        onOpen={onOpen}
        setOnOpen={setOnOpen}
      />
    </>
  );
};

export default ReservationsCardMenu;
