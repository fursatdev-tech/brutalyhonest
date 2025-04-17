import { getTours } from "@/lib/actions/getListings";
import { SafePackage } from "@/util/types";
import ToursHome from "@/components/tours/ToursHome";
import UpdateReferral from "@/components/referral/UpdateReferral";

interface Props {
  searchParams: Promise<{
    category?: string;
    location?: string;
  }>;
}

const Home = async ({ searchParams }: Props) => {
  const currSearchParams = await searchParams;

  const listings = await getTours(currSearchParams);

  const filteredListings =
    Object.keys(currSearchParams).length > 0
      ? listings
      : listings.filter((listing: SafePackage) => listing.isLive);

  return (
    <>
      <UpdateReferral />
      <ToursHome packages={filteredListings as SafePackage[]} />
    </>
  );
};

export default Home;
