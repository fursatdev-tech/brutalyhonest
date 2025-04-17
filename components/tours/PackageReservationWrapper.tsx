import { getCookieVal } from "@/lib/actions/getConvertedPrice";
import PackageReservation from "./PackageReservation";
import { PackageImages, Price, PriceEnum } from "@prisma/client";

interface WrapperProps {
  itinerary: string;
  sellingPrice: Price;
  startDate: Date;
  endDate: Date;
  subtitle: string;
  name: string;
  duration: string;
  accommodationImages: PackageImages[];
  tourId: string;
  maxGroupSize?: number;
  isLive: boolean;
}

export default async function PackageReservationWrapper(props: WrapperProps) {
  const currency: PriceEnum = (await getCookieVal()) as PriceEnum;

  // Now TypeScript knows that we're providing all required props
  return <PackageReservation {...props} currency={currency} />;
}
