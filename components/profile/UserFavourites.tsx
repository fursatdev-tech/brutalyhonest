import PageHeaderH1 from "@/util/PageHeaderH1";
import Listings from "@/components/listings/Listings";

import { getListings } from "@/lib/actions/getListings";

const UserFavourites = async () => {
  const listings = await getListings({ favourites: true });

  return (
    <>
      <PageHeaderH1 text={`My favourites`} />
      <Listings
        listings={listings}
        noDataTitle="You have not added any favourites yet."
        noDataSubtitle="Add your favourite listings to view them here."
      />
    </>
  );
};

export default UserFavourites;
