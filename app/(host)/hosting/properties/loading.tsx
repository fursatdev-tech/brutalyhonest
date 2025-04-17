import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton className="h-40 w-full rounded-xl" key={i} />
      ))}
    </div>
  );
};

export default loading;
