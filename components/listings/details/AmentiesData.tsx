"use client";
import { Amenity, AmenityDetail } from "@prisma/client";
import { IconType } from "react-icons";

import { getAmenityIcon } from "@/components/listings/details/getAmenityIcon";
import { cn } from "@/lib/utils";
import ShowAllAmenities from "@/components/listings/details/dialogs/ShowAllAmenities";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  amenities: Amenity[];
  mappedAmenities: AmenityDetail[];
  size?: number;
  variant?: "outline" | "link";
}

const AmentiesData = ({
  amenities,
  mappedAmenities,
  size = 10,
  variant,
}: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const spliceLength = isDesktop ? 40 : 20;

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        {mappedAmenities.slice(0, size).map((amenity, idx) => {
          const Icon: IconType = getAmenityIcon(amenity.title);

          return (
            <div className="flex gap-2 items-center" key={idx}>
              <Icon size={28} className="text-secondary-foreground" />
              <p
                className={cn("text-sm", !amenity.available && "line-through")}
              >
                {amenity.title.length > spliceLength
                  ? amenity.title.slice(0, spliceLength) + "..."
                  : amenity.title}
              </p>
            </div>
          );
        })}
      </div>

      <ShowAllAmenities
        amenities={amenities}
        length={mappedAmenities.length}
        variant={variant}
      />
    </>
  );
};

export default AmentiesData;
