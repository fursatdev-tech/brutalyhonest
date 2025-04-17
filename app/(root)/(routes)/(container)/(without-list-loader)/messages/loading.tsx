import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const InboxLoader = () => {
  return (
    <div className="col-span-3 space-y-6">
      <h1 className="font-bold !text-2xl">All messages</h1>

      <div className="divide-y space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="flex items-center gap-4 py-4" key={i}>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1 pr-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InboxLoader;
