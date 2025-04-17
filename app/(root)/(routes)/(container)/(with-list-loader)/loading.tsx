import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import ListCardLoader from "@/components/listings/ListCardLoader";

const loading = () => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      <ListCardLoader />
    </div>
  );
};

export default loading;
