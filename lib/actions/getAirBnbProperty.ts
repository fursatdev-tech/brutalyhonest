import axios from "axios";

import { toast } from "@/components/ui/use-toast";
import { AirBnbDetailItem, AirBnbPhotoTour } from "@/util/airbnb.interface";

export const getAirBnbProperty = async (
  propertyId: string,
  category?: string
) => {
  try {
    const response = await axios.get(
      `https://${process.env.NEXT_PUBLIC_RAPID_HOST}/api/v2/getPropertyDetails`,
      {
        params: { propertyId, currency: "USD" },
        headers: {
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
          "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_HOST,
        },
      }
    );

    const data = response.data.data;

    if (!data) return null;

    return {
      ...data,
      ...data.bookingData,
      title: data?.sections?.title?.title,
      description:
        data?.sections?.descriptionDefault?.descriptionSummary?.htmlText,
      imageUrl: data?.imageUrl,
      amenities: data?.sections?.amenities?.seeAllAmenitiesGroups,
      ...formatImages(data?.sections?.photoTour),
      ...formatOverView(data?.sections?.overview?.detailItems),
      ...formatPrice(
        data?.structuredDisplayPrice?.structuredDisplayPrice?.price
      ),
      category: category || data.category,
      guests: data.personCapacity,
      ...getStayRooms(data.title),
      allowFreeStay: true,
    };
  } catch (error: any) {
    toast({
      description: error?.response?.data?.message ?? "Something went wrong",
      duration: 3000,
      security: "destructive",
    });

    return [];
  }
};

const formatOverView = (overview: AirBnbDetailItem[]) => {
  let __data = {};

  overview?.forEach((item) => {
    const [value, key] = item.title.split(" ");
    __data = { ...__data, [key]: parseInt(value) };
  });

  return __data;
};

const formatPrice = (price: any) => {
  let slicedPrice = price?.slice(1).replace(/,/g, "");

  if (isNaN(slicedPrice)) slicedPrice = null;

  return {
    originalPrice: { inr: slicedPrice },
    b2bPrice: { inr: slicedPrice },
  };
};

const formatImages = (images: AirBnbPhotoTour): { images: string[] } => {
  const _images = images?.mediaItems?.map((item) => item.baseUrl);

  return { images: _images };
};

const getStayRooms = (title: string) => {
  let titleParts = title.split(" · ");

  if (!titleParts?.length) return { bedrooms: 1, baths: 1, beds: 1 };

  titleParts.shift();

  const res = titleParts.reduce(
    (acc, curr) => {
      const [count, type] = curr.split(" ");
      if (type === "bedrooms") {
        acc.bedrooms = parseInt(count);
      } else if (type === "beds") {
        acc.beds = parseInt(count);
      } else if (type === "baths") {
        acc.baths = parseInt(count);
      }
      return acc;
    },
    { bedrooms: 1, beds: 1, baths: 1 }
  );

  return res;
};
