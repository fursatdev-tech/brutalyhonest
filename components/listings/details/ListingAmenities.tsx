import { Amenity } from "@prisma/client";
import React from "react";

import AmentiesData from "@/components/listings/details/AmentiesData";

interface Props {
  amenities: Amenity[];
}

const ListingAmenities = ({ amenities }: Props) => {
  const allAmenities = amenities.flatMap((category) => category.amenities);

  return (
    <div className="space-y-6">
      <p className="font-bold">What this place offers</p>

      <AmentiesData amenities={amenities} mappedAmenities={allAmenities} />
    </div>
  );
};

export default ListingAmenities;
