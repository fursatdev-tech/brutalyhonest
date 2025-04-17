import { cn } from "@/lib/utils";
import DateBooking from "./DateBooking";
import GuestBooking from "./GuestBooking";

interface PageProps {
  allowsChildren: boolean;
  allowsInfants: boolean;
  allowsPets: boolean;
  minNights: number | null;
  maxNights: number | null;
  dateError: boolean;
  datePopover: boolean;
  guests: number;
  perGuestPricing: boolean;
  setDatePopover: (value: boolean) => void;
}

const Booking = ({ ...props }: PageProps) => {
  const { dateError } = props;
  return (
    <div className={cn("border rounded-xl", dateError && "border-destructive")}>
      <DateBooking {...props} />
      <GuestBooking {...props} />
    </div>
  );
};

export default Booking;
