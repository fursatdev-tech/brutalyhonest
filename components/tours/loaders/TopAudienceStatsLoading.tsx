import { Skeleton } from "@/components/ui/skeleton";

const TopAudienceStatsLoader = () => {
  return (
    <div className="col-span-2 shadow-sm p-6 rounded-2xl border text-center grid grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-6 w-[100px] mx-auto" />
          <Skeleton className="h-6 w-full" />
        </div>
      ))}
    </div>
  );
};

export default TopAudienceStatsLoader;
