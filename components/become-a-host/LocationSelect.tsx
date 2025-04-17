"use client";

import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import { IoIosSearch } from "react-icons/io";
import { toast } from "../ui/use-toast";

export type CountrySelectValue = {
  flag: string;
  label: string;
  latlng: [number, number];
  region: string;
  value: string;
};

interface CountrySelectProps {
  onChange: (value: [number, number], valueArea: string) => void;
  value: string;
}

const CountrySelect = ({ onChange, value = "" }: CountrySelectProps) => {
  return (
    <div>
      <span className="relative">
        <GooglePlacesAutocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
          onLoadFailed={(error) => {
            toast({
              description: error.message,
              duration: 3000,
              variant: "destructive",
            });
          }}
          //   apiOptions={{ language: "us", region: "us" }}
          debounce={300}
          selectProps={{
            placeholder: "Enter the address",
            defaultInputValue: value,
            onChange: ({ value }: any) => {
              geocodeByPlaceId(value?.place_id)
                .then((results) => {
                  const firstResult = results[0];
                  if (firstResult) {
                    let locationValue = firstResult.plus_code?.compound_code;
                    if (firstResult.plus_code?.compound_code?.includes("+")) {
                      const splitValues =
                        firstResult.plus_code?.compound_code?.split(" ");
                      locationValue = splitValues
                        .slice(1, splitValues.length)
                        .join(" ");
                    }

                    if (!locationValue) {
                      const formattedAddress = firstResult?.formatted_address
                        ?.split(",")
                        ?.slice(1)
                        ?.join(",")
                        .trim();
                      locationValue = formattedAddress;
                    }

                    onChange(
                      [
                        firstResult.geometry.location.lat(),
                        firstResult.geometry.location.lng(),
                      ],
                      locationValue ?? ""
                    );
                  } else {
                    toast({
                      description: "Could not find location",
                      duration: 3000,
                      variant: "destructive",
                    });
                  }
                })
                .catch((error) => {
                  toast({
                    description: error?.message ?? "Something went wrong",
                    duration: 3000,
                    variant: "destructive",
                  });
                });
            },
          }}
        />
        <div className="absolute top-2 right-2.5 bg-background pointer-events-none">
          <IoIosSearch color="#898989" size={20} />
        </div>
      </span>
    </div>
  );
};

export default CountrySelect;
