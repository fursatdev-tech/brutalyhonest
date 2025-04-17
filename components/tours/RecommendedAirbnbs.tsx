"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TbBrandAirbnb } from "react-icons/tb";

interface Listing {
  id: string;
  name: string;
  images: string[];
  price: {
    total: number;
    currency: string;
  };
  rating: number;
  reviewsCount: number;
  url: string;
  address: string;
  city: string;
}

interface ApiResponse {
  results: Listing[];
  total: number;
}

type Props = {
  cities: string[];
};

const RecommendedAirbnbs: React.FC<Props> = ({ cities }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const searchListings = async () => {
    if (!cities || cities.length === 0) return;

    const limitedCities = cities.length > 3 ? cities.slice(0, 3) : cities;

    setLoading(true);
    setError("");

    try {
      const promises = limitedCities.flatMap((city) => [
        // Airbnb API call
        fetch(
          `https://airbnb13.p.rapidapi.com/search-location?location=${city}&adults=1&children=0&infants=0&pets=0&page=1&currency=USD`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": `${process.env.NEXT_PUBLIC_RAPID_API_KEY_13}`,
              "X-RapidAPI-Host": `${process.env.NEXT_PUBLIC_RAPID_HOST_13}`,
            },
          }
        ),
      ]);

      const results = await Promise.allSettled(promises);

      const successfulResults = results
        .filter(
          (result): result is PromiseFulfilledResult<Response> =>
            result.status === "fulfilled" && result.value.ok
        )
        .map((result) => result.value.json());

      const allData = await Promise.all(successfulResults);

      console.log("All data:", allData);

      setListings(allData.flat());
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchListings();
  }, [cities]);

  if (listings.length === 0) {
    return <div></div>;
  }

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Recommended Hotels</h2>
      {loading && <div>Loading...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {listings.slice(0, 4).map((listing, index) => (
          <Card key={index} className="overflow-hidden  flex flex-col">
            {listing.images?.[0] && (
              <div className="relative w-full h-[200px]">
                <img
                  src={listing.images[0]}
                  alt={listing.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-4 flex flex-col flex-grow">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                {listing.name}
              </h3>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">{""}</span>
                <div className="flex items-center gap-1">
                  <span>★ {listing.rating}</span>
                  <span className="text-gray-500">
                    ({listing.reviewsCount})
                  </span>
                </div>
              </div>
              <div className="mt-auto">
                <Button
                  className="w-full"
                  onClick={() => window.open(listing.url, "_blank")}
                >
                  <TbBrandAirbnb className="mr-2" />
                  Book on Airbnb
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedAirbnbs;
