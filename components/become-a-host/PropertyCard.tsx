"use client";

import { format } from "date-fns";
import Link from "next/link";
import { ListingStatus } from "@prisma/client";

import { SafeProperty } from "@/util/types";
import BImage from "@/util/Image";
import { Separator } from "@/components/ui/separator";
import RatingC from "@/util/Rating";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import PropertyCardMenu from "@/components/become-a-host/PropertyCardMenu";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  data: SafeProperty;
  actionId?: string;
}

const PropertyCard = ({ data }: PropertyCardProps) => {
  return (
    <div className="grid grid-cols-12">
      <Link
        href={`/become-a-host/property-type?id=${data.id}`}
        className="relative min-h-[220px] w-full overflow-hidden rounded-t-xl md:rounded-tr-none md:rounded-l-xl col-span-12 md:col-span-5 group"
      >
        <BImage
          className="h-full w-full transition duration-300 ease-in group-hover:scale-110"
          src={data.imageUrl}
          alt="Listing"
        />
      </Link>

      <div className="relative col-span-12 md:col-span-7 space-y-3 p-4 border border-t-0 md:border-t md:border-l-0 rounded-b-xl md:rounded-bl-none md:rounded-r-xl flex flex-col justify-around">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Badge
              variant={
                data.status === ListingStatus.unpublished ||
                data.status === ListingStatus.deleted
                  ? "destructive"
                  : data.status === ListingStatus.published
                  ? "default"
                  : "secondary"
              }
              className="capitalize absolute bottom-3 right-3"
            >
              {data.status}
            </Badge>

            <p className="font-bold text-lg leading-snug">{data?.title}</p>

            <div className="text-sm flex gap-2 items-center">
              <RatingC
                rating={data.guestSatisfactionOverall}
                noRatingText="No rating"
              />
              <span>&#x2022;</span>
              <p className="text-xs font-semibold text-secondary-foreground">
                Posted on {format(new Date(data?.createdAt), "PP")}
              </p>
            </div>

            <p className="text-xs font-semibold text-secondary-foreground">
              {data?.propertyType} &#x2022; {data?.location} &#x2022;{" "}
              {data?.country}
            </p>
          </div>

          <PropertyCardMenu propertyId={data.id} status={data.status} />
        </div>

        <Separator />

        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={data?.host?.profilePhotoUrl || "images/placeholder.jpg"}
              alt="user"
            />
          </Avatar>
          <div className="block">
            <p className="text-muted font-normal text-xs">Hosted by</p>
            <p className="font-semibold text-sm">{data?.host?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
