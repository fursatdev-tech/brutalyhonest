import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const loading = () => {
  return (
    <Container className="flex flex-col gap-6 pt-5 lg:px-10">
      <div className="space-y-3">
        <Skeleton className="h-6 w-60" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <Skeleton className="h-[25rem] w-full rounded-l-xl rounded-r-none" />
        </div>

        <div className="col-span-1 space-y-4">
          <Skeleton className="h-48 w-full rounded-none" />
          <Skeleton className="h-48 w-full rounded-none" />
        </div>

        <div className="col-span-1 space-y-4">
          <Skeleton className="h-48 w-full rounded-none rounded-tr-xl" />
          <Skeleton className="h-48 w-full rounded-none  rounded-br-xl" />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-4 space-y-4">
          <Skeleton className="h-6 w-60" />
          <Skeleton className="h-4 w-32 " />
          <Separator />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Separator />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="col-span-2">
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    </Container>
  );
};

export default loading;
