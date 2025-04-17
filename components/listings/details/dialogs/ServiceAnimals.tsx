import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  title: string;
}

const ServiceAnimals = ({ title }: Props) => {
  return (
    <Dialog>
      <DialogTrigger className="underline text-secondary text-left">
        {title}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogDescription>
            <div className="relative w-full h-[500px] my-5 rounded-md">
              <Image
                fill
                src="/images/service-animals.png"
                alt="service-animals"
                className="object-cover rounded-md"
              />
            </div>

            <p className="font-bold text-xl">Service animals</p>
            <p>
              Service animals aren’t pets, so there’s no need to add them here.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceAnimals;
