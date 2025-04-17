"use client";
import { useContext, useEffect, useReducer } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

import { AirbnbDataContext } from "@/components/become-a-host/AirbnbContext";
import PropertyHeader from "@/components/become-a-host/PropertyHeader";
import { Button } from "@/components/ui/button";
import {
  ADD_PROPERTY_FEATURES,
  initialState,
  propertyFeaturesReducer,
} from "@/util/reducers/addPropertyFeatures";
import { PropertyFeaturesItem } from "@/components/become-a-host/host.interface";

const PropertyFeatures = () => {
  const { propertyDetails, setPropertyDetails } = useContext(AirbnbDataContext);

  const [state, dispatch] = useReducer(
    propertyFeaturesReducer,
    initialState({
      guests: propertyDetails.guests || 1,
      bedrooms: propertyDetails.bedrooms || 1,
      beds: propertyDetails.beds || 1,
      baths: propertyDetails.baths || 1,
    })
  );

  const propertyDetailsData: PropertyFeaturesItem[] = [
    {
      title: "Guests",
      subtitle: "How many guests do you allow?",
      state: state?.guests,
      disables: { decrement: state?.guests === 1, increment: false },
      actions: {
        increment: ADD_PROPERTY_FEATURES.INCREMENT_GUESTS,
        decrement: ADD_PROPERTY_FEATURES.DECREMENT_GUESTS,
      },
    },
    {
      title: "Bedrooms",
      subtitle: "How many bedrooms do you have?",
      state: state?.bedrooms,
      disables: { decrement: state?.bedrooms === 1, increment: false },
      actions: {
        increment: ADD_PROPERTY_FEATURES.INCREMENT_BEDROOMS,
        decrement: ADD_PROPERTY_FEATURES.DECREMENT_BEDROOMS,
      },
    },
    {
      title: "Beds",
      subtitle: "How many beds do you have?",
      state: state?.beds,
      disables: { decrement: state?.beds === 1, increment: false },
      actions: {
        increment: ADD_PROPERTY_FEATURES.INCREMENT_BEDS,
        decrement: ADD_PROPERTY_FEATURES.DECREMENT_BEDS,
      },
    },
    {
      title: "Bathrooms",
      subtitle: "How many bathrooms do you have?",
      state: state?.baths,
      disables: { decrement: state?.baths === 1, increment: false },
      actions: {
        increment: ADD_PROPERTY_FEATURES.INCREMENT_BATHS,
        decrement: ADD_PROPERTY_FEATURES.DECREMENT_BATHS,
      },
    },
  ];

  useEffect(() => {
    setPropertyDetails((prev) => ({ ...prev, ...state }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="space-y-8">
      <PropertyHeader
        title="Share the Property Features"
        subtitle="Enter information about guest capacity, number of rooms, and bathrooms"
      />

      <div className="max-w-md mx-auto space-y-8">
        {propertyDetailsData.map((item, idx) => (
          <div
            className="flex justify-between items-center border-b-2 last:border-b-0 pb-6"
            key={idx}
          >
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-muted text-sm">{item.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={item.disables.decrement || item?.state === 0}
                onClick={() => dispatch({ type: item.actions.decrement })}
              >
                <CiCircleMinus size={28} />
              </Button>
              <p>{item?.state}</p>
              <Button
                variant="ghost"
                size="icon"
                disabled={item.disables.increment}
                onClick={() => dispatch({ type: item.actions.increment })}
              >
                <CiCirclePlus size={28} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyFeatures;
