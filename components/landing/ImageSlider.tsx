import { heroImages } from "@/components/landing/data";
import Image from "next/image";

const ImageSlider = () => {
  const activeImg = heroImages[0];

  return (
    <div className="hidden md:flex overflow-hidden">
      <div
        key={activeImg.id}
        className="overflow-hidden w-full h-full m-auto flex items-center justify-center relative"
      >
        <Image
          alt={activeImg.name}
          src={activeImg.url}
          className="object-contain object-center m-auto"
          fill
        />
      </div>
    </div>
  );
};

export default ImageSlider;
