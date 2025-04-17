import { BsChevronRight } from "react-icons/bs";

interface Props {
  description: {
    __html: string;
  };
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MoreDescription = ({ description }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="font-bold flex gap-1 items-center">
          <p className="cursor-pointer underline w-fit">Show more</p>
          <BsChevronRight />
        </div>
      </DialogTrigger>
      <DialogContent className="overflow-hidden max-w-xl">
        <DialogHeader className="text-left">
          <DialogTitle>
            <p className="text-xl">About this space</p>
          </DialogTitle>
          <DialogDescription>
            <p className="my-8" dangerouslySetInnerHTML={description}></p>

            <p className="font-bold">The space</p>
            <p className="text-sm">Book now for an unforgettable vacation.</p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MoreDescription;
