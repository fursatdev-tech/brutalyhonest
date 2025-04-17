import { Skeleton } from "@/components/ui/skeleton";

const SurveyLoading = () => {
  return (
    <div className="flex flex-col space-y-6 p-8">
      <Skeleton className="h-48 w-full rounded-xl" />

      <Skeleton className="h-16 w-full" />

      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20 md:w-40" />
        <Skeleton className="h-8 w-20 md:w-40" />
      </div>
    </div>
  );
};

export default SurveyLoading;
