import { Skeleton } from "@/components/ui/skeleton";

const PropertyLoader = () => {
  return (
    <div className="space-y-8 mx-auto max-w-md">
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-6 w-3/4 mx-auto" />
      </div>

      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
};

export default PropertyLoader;
