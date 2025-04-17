import { SafeTourReservation } from "@/util/types";
import ListCardLoader from "@/components/listings/ListCardLoader";
import Nodata from "@/util/Nodata";
import { cn } from "@/lib/utils";
import TourReservationsCard from "@/components/tours/TourReservationsCard";

interface ReservationProps {
  reservations: SafeTourReservation[];
  loading: boolean;
}

const TourReservations = ({
  reservations,
  loading = false,
}: ReservationProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 pb-28 mt-8",
        !loading && !!reservations.length && "divide-y"
      )}
    >
      {loading ? (
        <ListCardLoader />
      ) : (
        reservations.map((reservation) => (
          <TourReservationsCard key={reservation.id} data={reservation} />
        ))
      )}

      {!loading && reservations.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center">
          <Nodata
            title="No trip found"
            subtitle="Book your first trip on Furat to get an amazing deal."
          />
        </div>
      )}
    </div>
  );
};

export default TourReservations;
