import { Skeleton } from "@/components/ui/skeleton";

const PropertyLoader = () => {
  return (
    <div className="space-y-8 mx-auto max-w-xl">
      <Skeleton className="h-20 w-20 rounded-full" />

      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>

      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
};

export default PropertyLoader;
