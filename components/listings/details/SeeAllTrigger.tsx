import { IoChevronBack } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageGallery from "@/components/listings/details/ImageGallery";

interface Props {
  images: string[];
  title: string;
  show: boolean;
  setShow: (show: boolean) => void;
}

const SeeAllTrigger = ({ images, title, show, setShow }: Props) => {
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button variant="white" className="absolute bottom-4 right-4 z-10">
          See all photos
        </Button>
      </DialogTrigger>

      <DialogContent
        className="w-screen h-screen min-w-full max-w-screen min-h-screen"
        hideClose
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-between items-center static top-0">
              <DialogClose asChild>
                <Button size="icon" variant="ghost">
                  <IoChevronBack size={20} />
                </Button>
              </DialogClose>
            </div>
          </DialogTitle>
          <DialogDescription asChild>
            <ImageGallery images={images} title={title} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SeeAllTrigger;
