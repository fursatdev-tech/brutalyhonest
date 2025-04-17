"use client";

import { format } from "date-fns";
import Link from "next/link";
import { PaymentStatus, ReservationStatus, ReviewStatus } from "@prisma/client";
import { useCallback, useState } from "react";

import HeartButton from "@/components/common/HeartButton";
import { SafeReservation } from "@/util/types";
import BImage from "@/util/Image";
import { Badge } from "@/components/ui/badge";
import ReservationsCardMenu from "@/components/profile/ReservationsCardMenu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import initStripeCheckout from "@/lib/useStripeCheckout";
import AmentiesData from "@/components/listings/details/AmentiesData";
import { cn } from "@/lib/utils";

interface ReservationCardProps {
  data: SafeReservation;
  actionId?: string;
  favouriteIds?: string[];
}

const ReservationsCard = ({
  data,
  favouriteIds = [],
}: ReservationCardProps) => {
  const [loading, setLoading] = useState(false);

  const title = data?.listing?.title;
  const startDate = data?.startDate;
  const endDate = data?.endDate;
  const image = data?.listing?.imageUrl;
  const listingId = data?.listing?.id;
  const totalPrice = data?.totalPrice;
  const minNights = data?.listing?.minNights;
  const maxNights = data?.listing?.maxNights;

  const reserve = useCallback(
    async () =>
      await initStripeCheckout({
        endDate: new Date(endDate),
        image,
        listingId,
        startDate: new Date(startDate),
        title,
        totalPrice,
        setLoading,
        minNights,
        maxNights,
      }),
    [
      endDate,
      image,
      listingId,
      maxNights,
      minNights,
      startDate,
      title,
      totalPrice,
    ]
  );

  const allAmenities = data.listing.amenities.flatMap(
    (category) => category.amenities
  );

  return (
    <div className="col-span-full pt-8 first:pt-0">
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-4 order-1 md:order-0 flex flex-col justify-around relative space-y-3 p-4 border border-t-0 md:border-t md:border-r-0 rounded-b-xl md:rounded-br-none md:rounded-l-xl">
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="font-bold text-xl">{data?.listing?.title}</p>
              <p className="text-sm">
                {data?.listing.propertyType} by {data?.listing?.host?.name}
              </p>
            </div>

            <ReservationsCardMenu
              paymentStatus={data.paymentStatus}
              status={data.status}
              reservationId={data.id}
            />
          </div>

          <Separator />

          <div className="flex gap-6 h-16">
            <div className="font-semibold">
              <p>{format(new Date(data.startDate), "dd LLL")} -</p>
              <p>{format(new Date(data.endDate), "dd LLL")}</p>
              <p className="text-sm font-normal text-secondary-foreground">
                {format(new Date(data.endDate), "yyyy")}
              </p>
            </div>

            <Separator orientation="vertical" />

            <div className="font-semibold">
              <p> {data?.listing.location} </p>
              <p className="text-secondary-foreground text-sm">
                {" "}
                {data?.listing.country}{" "}
              </p>
            </div>
          </div>

          <Badge
            variant={
              data.status === ReservationStatus.canceled
                ? "destructive"
                : data.status === ReservationStatus.confirmed
                ? "default"
                : "secondary"
            }
            className={cn(
              "capitalize absolute bottom-3 right-3",
              data.status === ReservationStatus.confirmed && "trip-completed"
            )}
          >
            {data.status}
          </Badge>
        </div>

        <Link
          href={`/listings/${data.listing.id}`}
          className="col-span-12 md:col-span-4 order-0 md:order-1 relative min-h-[220px] w-full overflow-hidden rounded-t-xl md:rounded-tl-none md:rounded-r-xl group"
        >
          <BImage
            className="h-full w-full transition duration-300 ease-in group-hover:scale-110"
            src={data.listing.imageUrl}
            alt="Listing"
          />
          <div className="absolute right-3 top-3">
            <HeartButton listingId={data.id} favouriteIds={favouriteIds} />
          </div>
        </Link>

        <div className="col-span-0 hidden md:block md:col-span-4 md:order-2 pl-8">
          {data.paymentStatus !== PaymentStatus.succeeded ? (
            <p className="border-2 rounded-xl p-3 border-destructive">
              Your payment for this reservation was not successful.{" "}
              <Button
                variant="link"
                className="p-0 h-fit underline"
                onClick={reserve}
                disabled={loading}
                loading={loading}
              >
                Retry payment
              </Button>
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-secondary-foreground">
                Amenities in your property
              </p>
              <AmentiesData
                amenities={data.listing.amenities}
                mappedAmenities={allAmenities}
                size={8}
                variant="link"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationsCard;
