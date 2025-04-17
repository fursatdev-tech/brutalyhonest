import Link from "next/link";
import { Price } from "@prisma/client";

import HeartButton from "@/components/common/HeartButton";
import { SafeListing } from "@/util/types";
import RatingC from "@/util/Rating";
import BImage from "@/util/Image";
import { getCookieVal } from "@/lib/actions/getConvertedPrice";

interface ListingCardProps {
  data: SafeListing;
  favouriteIds?: string[];
}

const ListingCard = async ({ data, favouriteIds = [] }: ListingCardProps) => {
  const currency = await getCookieVal();

  const symbol = currency === "usd" ? "$" : "₹";

  const price = parseInt(data.originalPrice[currency as keyof Price] || "0");

  return (
    <Link
      href={`/listings/${data.id}`}
      className="group col-span-1 cursor-pointer"
    >
      <div className="flex w-full flex-col gap-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <BImage
            className="h-full w-full transition duration-300 ease-in group-hover:scale-110"
            src={data.imageUrl}
            alt="Listing"
          />
          <div className="absolute right-3 top-3">
            <HeartButton listingId={data.id} favouriteIds={favouriteIds} />
          </div>
        </div>
        <div className="flex justify-between text-xs md:text-sm">
          <div>
            <p className="font-semibold">
              {data?.location?.length > 20
                ? data?.location.substring(0, 20) + "..."
                : data?.location}
            </p>
            <p className="font-light text-secondary-foreground capitalize">
              {data?.category?.label}
            </p>
            <div className="flex flex-row items-center gap-1">
              <p className="font-semibold text-lg text-secondary">
                {symbol} {price.toLocaleString()}
              </p>
              <span className="font-light text-secondary-foreground">
                night
              </span>
            </div>
          </div>
          <div className="flex items-start justify-start">
            <RatingC rating={data.guestSatisfactionOverall} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
