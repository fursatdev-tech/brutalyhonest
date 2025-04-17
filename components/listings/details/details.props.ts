import { Amenity, Category, ListingStatus, Price } from "@prisma/client";

export interface ListingReservationProps {
  imageUrl: string;
  title: string;
  id: string;
  originalPrice: Price;
  allowsChildren: boolean;
  allowsInfants: boolean;
  allowsPets: boolean;
  perGuestPricing: boolean;
  guests: number;
  status: ListingStatus;
  minNights: number | null;
  maxNights: number | null;
  pgOriginalPrice: Price | null;
  allowFreeStay: boolean;
}

export interface ListingInfoProps {
  title: string;
  description: string;
  guests: number;
  beds: number;
  baths: number;
  bedrooms: number;
  category: Omit<Category, "createdAt" | "updatedAt">;
  guestSatisfactionOverall: number | null;
  reviewsCount: number | null;
  listingLat: number;
  listingLng: number;
  propertyType: string;
  location: string;
  user: {
    name: string | null;
    image: string | null;
  };
  amenities: Amenity[];
}
