import { cn } from "@/lib/utils";

import { BsExclamationCircle } from "react-icons/bs";

interface Props {
  className?: string;
}

const DateError = ({ className }: Props) => {
  return (
    <small
      className={cn(
        "text-destructive text-xs flex gap-1 items-center",
        className
      )}
    >
      <BsExclamationCircle /> Selected dates are not available
    </small>
  );
};

export default DateError;
