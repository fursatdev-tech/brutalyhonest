import axios from "axios";
import useSWR from "swr";

import { SafeReservation } from "@/util/types";
import { getFavouriteIds } from "@/util/routes";
import ListCardLoader from "@/components/listings/ListCardLoader";
import Nodata from "@/util/Nodata";
import ReservationsCard from "@/components/profile/ReservationsCard";
import { cn } from "@/lib/utils";

interface ReservationProps {
  reservations: SafeReservation[];
  loading: boolean;
}

const Reservations = ({ reservations, loading = false }: ReservationProps) => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

  const { data: favouriteIds = [] } = useSWR(getFavouriteIds, fetcher);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 pb-28",
        !loading && !!reservations.length && "divide-y"
      )}
    >
      {loading ? (
        <ListCardLoader />
      ) : (
        reservations.map((reservation) => (
          <ReservationsCard
            key={reservation.id}
            data={reservation}
            favouriteIds={favouriteIds as string[]}
          />
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

export default Reservations;
