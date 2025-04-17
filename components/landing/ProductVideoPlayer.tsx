import Image from "next/image";
import { FaPlayCircle } from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { productVideoUrl } from "@/util/constants";

const ProductVideoPlayer = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="col-span-1 md:col-span-2 order-0 md:order-1 rounded-2xl p-6 text-center border w-full h-full md:h-72 relative cursor-pointer group">
          <Image
            src="/images/logo.png"
            fill
            className="object-contain rounded-2xl p-1 md:p-5 opacity-60"
            alt="brutalyhonest"
          />

          <div className="absolute inset-x-0 top-[35%]">
            <FaPlayCircle
              size={74}
              className="m-auto bg-background rounded-full text-muted-foreground group-hover:text-primary transition-colors duration-300"
            />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="space-y-6">
          <DialogTitle className="px-4 pt-4">How to get started</DialogTitle>
          <DialogDescription>
            <div className="relative pb-[62.5%] h-0">
              <iframe
                src={productVideoUrl}
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-lg"
              ></iframe>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProductVideoPlayer;
