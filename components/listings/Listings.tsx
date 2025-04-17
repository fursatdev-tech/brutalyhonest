import ListingCard from "@/components/listings/ListingsCard";
import { SafeListing } from "@/util/types";
import Nodata from "@/util/Nodata";
import { getAllFavourites } from "@/lib/actions/getAllFavourites";

interface ListingsProps {
  listings: SafeListing[];
  noDataTitle?: string;
  noDataSubtitle?: string;
}

const Listings = async ({ listings, ...props }: ListingsProps) => {
  const favouriteIds = await getAllFavourites();

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 pb-28">
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.id}
          data={listing}
          favouriteIds={favouriteIds}
        />
      ))}

      {listings.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center">
          <Nodata title={props.noDataTitle} subtitle={props.noDataSubtitle} />
        </div>
      )}
    </div>
  );
};

export default Listings;
