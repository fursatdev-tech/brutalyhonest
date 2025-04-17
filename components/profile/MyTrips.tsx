"use client";
import useSWR from "swr";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ReservationStatus, ReviewStatus } from "@prisma/client";
import { parseAsString, useQueryState } from "nuqs";

import PageHeaderH1 from "@/util/PageHeaderH1";
import Reservations from "@/components/profile/Reservations";
import { getMyReservations, getMyTourReservations } from "@/util/routes";
import { SafeReservation, SafeTourReservation } from "@/util/types";
import { handleError } from "@/util/swrErrorHandler";
import { Button } from "@/components/ui/button";
import ReviewBase from "@/components/profile/review/ReviewBase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TourReservations from "@/components/tours/TourReservations";
import { Fragment } from "react";

const MyTripsComponent = () => {
    const router = useRouter();
    const [tab, setTab] = useQueryState(
        "tab",
        parseAsString.withDefault("trips")
    );

    const fetcher = (url: string) => axios.get(url).then((res) => res.data);

    const { data = [], isLoading } = useSWR(
        getMyReservations,
        fetcher,
        handleError
    );

    const { data: dataTour = [], isLoading: isLoadingTour } = useSWR(
        getMyTourReservations,
        fetcher,
        handleError
    );

    return (
        <>
            <div className="flex justify-between items-center mb-8 pb-4 border-b">
                <PageHeaderH1 text="My Trips" className="pb-0" />
                <Button
                    className="rounded-full"
                    onClick={() => router.push("/messages")}
                >
                    Get help
                </Button>
            </div>

            <div>
                {data.map((data: SafeReservation, index: number) => {
                    const reviewStatus = data?.review?.status;

                    return (
                        <Fragment key={index}>
                            {data.status === ReservationStatus.completed &&
                                (!reviewStatus ||
                                    reviewStatus === ReviewStatus.draft) && (
                                    <ReviewBase data={data} />
                                )}
                        </Fragment>
                    );
                })}

                <Reservations
                    reservations={data as SafeReservation[]}
                    loading={isLoading}
                />
            </div>

            {/* <Tabs defaultValue={tab}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="tours">Tours</TabsTrigger>
        </TabsList>

        <TabsContent value="trips" className="mt-8">
          {data.map((data: SafeReservation, index: number) => {
            const reviewStatus = data?.review?.status;

            return (
              <Fragment key={index}>
                {data.status === ReservationStatus.completed &&
                  (!reviewStatus || reviewStatus === ReviewStatus.draft) && (
                    <ReviewBase data={data} />
                  )}
              </Fragment>
            );
          })}

          <Reservations
            reservations={data as SafeReservation[]}
            loading={isLoading}
          />
        </TabsContent>

        <TabsContent value="tours">
          <TourReservations
            reservations={dataTour as SafeTourReservation[]}
            loading={isLoadingTour}
          />
        </TabsContent>
      </Tabs> */}
        </>
    );
};

export default MyTripsComponent;
