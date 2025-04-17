import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const InboxLoader = () => {
  return (
    <>
      <Skeleton className="h-6 w-96" />

      <div className="max-w-2xl m-auto">
        {Array.from({ length: 6 }).map((_, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              className={cn(
                "flex items-center gap-2 py-6 max-w-md",
                isEven ? "mr-auto" : "ml-auto"
              )}
              key={i}
            >
              <Skeleton
                className={cn(
                  "h-12 w-12 rounded-full order-1",
                  isEven && "order-0"
                )}
              />
              <div className={cn("space-y-2 flex-1 pr-3", isEven && "order-0")}>
                <Skeleton className="h-4 w-full" />
                <Skeleton
                  className={cn("h-4 w-3/4 ml-auto", isEven && "ml-0 mr-auto")}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default InboxLoader;
