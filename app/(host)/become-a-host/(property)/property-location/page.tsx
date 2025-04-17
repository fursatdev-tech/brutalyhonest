"use client";
import { useContext, useMemo } from "react";
import dynamic from "next/dynamic";

import { AirbnbDataContext } from "@/components/become-a-host/AirbnbContext";
import PropertyHeader from "@/components/become-a-host/PropertyHeader";
import CountrySelect from "@/components/become-a-host/LocationSelect";

const PropertyLocation = () => {
  const { propertyDetails, setPropertyDetails } = useContext(AirbnbDataContext);

  const latLong = [propertyDetails.listingLat, propertyDetails.listingLng];

  const Map = useMemo(
    () =>
      dynamic(() => import("@/util/Map"), {
        ssr: false,
      }),
    []
  );

  const setLocation = (latLong: { lat: number; lng: number }) => {
    setPropertyDetails((prev) => ({
      ...prev,
      listingLat: latLong.lat,
      listingLng: latLong.lng,
    }));
  };

  return (
    <div className="space-y-8">
      <PropertyHeader
        title="Where is the property located?"
        subtitle="Specify the property's location to help guests plan their stay"
      />

      <div className="max-w-xl mx-auto space-y-8">
        <CountrySelect
          value={propertyDetails.location}
          onChange={(value: [number, number], valueArea: string) =>
            setPropertyDetails((prev) => ({
              ...prev,
              location: valueArea,
              listingLat: value[0],
              listingLng: value[1],
            }))
          }
        />

        {latLong[0] && (
          <Map location={latLong} setLocation={setLocation} draggable />
        )}
      </div>
    </div>
  );
};

export default PropertyLocation;
