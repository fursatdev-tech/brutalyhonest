"use client";
import { Amenity, Listing } from "@prisma/client";
import { Dispatch, createContext } from "react";

interface AirbnbDataProps {
  // data: AirbnbData;
  propertyDetails: AirbnbData;
  setPropertyDetails: Dispatch<React.SetStateAction<AirbnbData>>;
}

export const AirbnbDataContext = createContext<AirbnbDataProps>(
  {} as AirbnbDataProps
);

export type AirbnbData = Omit<
  Listing,
  | "id"
  | "createdAt"
  | "discountedPrice"
  | "categoryId"
  | "status"
  | "reviewsCount"
  | "userId"
  | "assistantId"
  | "hostId"
  | "coHostIds"
> & {
  overview: string[];
  isSuperhost: boolean;
  category: string;
  hostName: string;
  hostEmail: string;
  hostPhone: string;
  postedByOwner: boolean;
  hostProfilePhotoUrl?: string;
  amenities?: Amenity[];
};

interface AirbnbDataProviderProps extends AirbnbDataProps {
  children: React.ReactNode;
}

export const AirbnbDataProvider = ({
  children,
  ...props
}: AirbnbDataProviderProps) => {
  return (
    <AirbnbDataContext.Provider value={{ ...props }}>
      {children}
    </AirbnbDataContext.Provider>
  );
};
