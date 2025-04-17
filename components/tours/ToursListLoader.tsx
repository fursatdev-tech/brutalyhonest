import { Skeleton } from "@/components/ui/skeleton";

const ToursListLoader = () => {
  return (
    <div className="grid grid-cols-2 gap-6 px-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  );
};

export default ToursListLoader;
