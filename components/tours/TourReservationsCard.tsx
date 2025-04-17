"use client";

import { format } from "date-fns";
import Link from "next/link";
import { ReservationStatus } from "@prisma/client";
import { IoLocateOutline } from "react-icons/io5";

import { SafeTourReservation } from "@/util/types";
import BImage from "@/util/Image";
import { Badge } from "@/components/ui/badge";
import ReservationsCardMenu from "@/components/profile/ReservationsCardMenu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

interface ReservationCardProps {
  data: SafeTourReservation;
  actionId?: string;
}

const TourReservationsCard = ({ data }: ReservationCardProps) => {
  // const fileId = data?.package?.accommodationImages[0].urls[0].split("/").pop();
  const url = data?.package?.accommodationImages[0].urls[0].split("/").pop();

  return (
    <div className="col-span-full pt-8 first:pt-0">
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-4 order-1 md:order-0 flex flex-col justify-around relative space-y-3 p-4 border border-t-0 md:border-t md:border-r-0 rounded-b-xl md:rounded-br-none md:rounded-l-xl">
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="font-bold text-xl">{data?.package?.name}</p>
              <p className="text-sm">{data?.package?.subtitle}</p>
            </div>

            {/* <ReservationsCardMenu
              paymentStatus={data.paymentStatus}
              status={data.status}
              reservationId={data.id}
            /> */}
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
              <p> {data?.package.natureOfTravel} </p>
              <p className="text-secondary-foreground text-sm">
                {" "}
                {data?.package?.duration}{" "}
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
          href={`/tours/${data.package.id}`}
          className="col-span-12 md:col-span-4 order-0 md:order-1 relative min-h-[220px] w-full overflow-hidden rounded-t-xl md:rounded-tl-none md:rounded-r-xl group"
        >
          <BImage
            className="h-full w-full transition duration-300 ease-in group-hover:scale-110"
            // src={`https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`}
            src={url ?? ""}
            alt="Listing"
          />
        </Link>

        <div className="col-span-0 hidden md:block md:col-span-4 md:order-2 pl-8">
          <div className="space-y-4">
            <p className="text-xs font-bold text-secondary-foreground">
              Cities Travelling
            </p>

            <div>
              {data?.package?.citiesTraveling?.map((city, index) => (
                <Fragment key={index}>
                  <p className="text-sm flex gap-2 items-center">
                    <IoLocateOutline /> {city}
                  </p>
                  {index !== data?.package?.citiesTraveling.length - 1 && (
                    <Separator
                      orientation="vertical"
                      className="h-5 ml-[6px]"
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourReservationsCard;
