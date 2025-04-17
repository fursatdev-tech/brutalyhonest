import axios from "axios";
import { Amenity, Price } from "@prisma/client";

import { toast } from "@/components/ui/use-toast";
import { AirbnbData } from "@/components/become-a-host/AirbnbContext";

export const getBookingDotComProperty = async (
  url: string,
  category?: string
) => {
  try {
    const response = await axios.get(
      `https://${process.env.NEXT_PUBLIC_RAPID_HOST}/stays/properties/detail-by-url`,
      {
        params: { url, currency: "USD" },
        headers: {
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY_BOOKING,
          "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_HOST_BOOKING,
        },
      }
    );

    let data = response.data;

    if (!data.status) return null;

    data = data.data;

    const images = data.RTRoomPhoto.map(
      (image: any) => `https://cf.bstatic.com${image.photoUri}`
    );

    const amenities: Amenity[] = data.GenericFacilityHighlight.map(
      (facility: any) => ({
        title: facility.title,
        amenities: [
          {
            title: facility.title,
            available: true,
            images: [],
          },
        ],
      })
    );

    const propertyData: AirbnbData = {
      title: data.BasicPropertyData[0].name,
      propertyType: data.Property[0].accommodationType.type,
      location: data.BasicPropertyData[0].location.city,
      imageUrl: images[0],
      images,
      listingLat: data.BasicPropertyData[0].location.latitude,
      listingLng: data.BasicPropertyData[0].location.longitude,
      roomType: data.Property[0].accommodationType.type + "ROOM",
      allowsChildren: data.ChildAndBedPolicy[0].allowChildren,
      allowsInfants: data.ChildAndBedPolicy[0].allowCribs,
      allowsPets: false,
      minNights: 1,
      maxNights: 30,
      canInstantBook: false,
      originalPrice: { inr: "0" } as Price,
      b2bPrice: { inr: "0" } as Price,
      overview: [],
      locationRating: 0,
      valueRating: 0,
      communicationRating: 0,
      checkinRating: 0,
      accuracyRating: 0,
      cleanlinessRating: 0,
      guestSatisfactionOverall: 0,
      isSuperhost: false,
      category: category ?? "hotel",
      description: data.HotelTranslation[0].description,
      guests: data.RTRoomCard.length,
      bedrooms: data.RTRoomCard.length,
      beds: data.RTRoomCard.length,
      baths: data.RTRoomCard.map((room: any) => room.bathroomCount).reduce(
        (a: number, b: number) => a + b,
        0
      ),
      hostName: data.Property[0].name,
      hostProfilePhotoUrl: !!data?.Brand?.length ? data.Brand[0].logoUrl : "",
      hostEmail: "",
      hostPhone: "",
      perGuestPricing: false,
      pgOriginalPrice: null,
      pgB2bPrice: null,
      cancellationPolicyId: "",
      postedByOwner: false,
      allowFreeStay: true,
      amenities,
      country: "India",
    };

    return propertyData;
  } catch (error: any) {
    toast({
      description: error?.response?.data?.message ?? "Something went wrong",
      duration: 3000,
      security: "destructive",
    });

    return [];
  }
};
