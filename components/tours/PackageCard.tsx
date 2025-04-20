import { Price } from "@prisma/client";
import { LuExternalLink } from "react-icons/lu";

import { SafePackage } from "@/util/types";
import { getCookieVal } from "@/lib/actions/getConvertedPrice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BImage from "@/util/Image";
import { Link } from "../ui/link";

interface CardProps {
  data: SafePackage;
}

const PackageCard = async ({ data }: CardProps) => {
  const currency = await getCookieVal();

  const symbol = currency === "usd" ? "$" : "₹";

  const price = parseInt(data.sellingPrice[currency as keyof Price] || "0");

  const images = data.accommodationImages.flatMap((group) =>
    group.urls.map((url) => {
      // const fileId = url.split("/").pop();
      // return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
      return url;
    })
  );

  return (
    <div className="col-span-1 h-full">
      <div className="flex flex-col gap-2 w-full">
        <div className="relative rounded-xl w-full overflow-hidden aspect-square flex-shrink-0">
          <Carousel className="group">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="relative w-full aspect-square"
                >
                  <BImage
                    src={image}
                    alt="Property Image"
                    className="w-full h-full"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="group-hover:flex hidden ml-14 transition" />
            <CarouselNext className="group-hover:flex hidden mr-14 transition" />
          </Carousel>
        </div>

        <Link
          prefetch={true}
          href={`/tours/${encodeURIComponent(data.name)}`}
          className="text-xs md:text-sm group flex flex-col flex-1 overflow-hidden"
        >
          <p className="font-semibold text-base line-clamp-2">
            {data?.name} ({data.duration})
          </p>

          <p className="font-light text-secondary-foreground capitalize truncate">
            {data?.natureOfTravel}
          </p>

          <div className="flex justify-between items-center gap-1 mt-auto">
            <p className="font-semibold text-base text-secondary">
              {symbol} {price.toLocaleString()}
            </p>

            <LuExternalLink
              className="group-hover:text-secondary text-secondary-foreground transition"
              size={18}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PackageCard;
