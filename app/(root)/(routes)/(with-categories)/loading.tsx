import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import ListCardLoader from "@/components/listings/ListCardLoader";

const loading = () => {
  return (
    <Container className="flex flex-col gap-6 pt-5">
      <div className="flex gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Skeleton key={idx} className="w-24 h-16" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <ListCardLoader />
      </div>
    </Container>
  );
};

export default loading;
