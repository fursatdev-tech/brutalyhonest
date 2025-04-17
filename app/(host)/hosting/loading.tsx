import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <Container className="pb-28 space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 md:col-span-1 shadow-sm rounded-xl border p-4 md:p-6 space-y-4">
          <p className="font-medium md:text-lg">Listings views</p>

          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-primary-light">0</p>
            <p className="text-sm text-muted-foreground mb-1">
              Total views (last 7 days)
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-8 w-full md:h-10 rounded-lg mx-auto"
              />
            ))}
          </div>
        </div>

        <div className="col-span-3 md:col-span-2 shadow-sm rounded-xl border p-4 md:p-6 space-y-4">
          <p className="font-medium md:text-lg">Tours views</p>

          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-primary-light">0</p>
            <p className="text-sm text-muted-foreground mb-1">
              Total views (last 7 days)
            </p>
          </div>

          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-48 w-8 md:w-10 rounded-lg mx-auto"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="shadow-sm rounded-xl border p-4 md:p-6 space-y-4">
        <p className="font-medium md:text-lg">Performance</p>
        <p className="text-sm text-muted-foreground">
          Comparison between Sales and Earnings
        </p>

        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    </Container>
  );
};

export default loading;
