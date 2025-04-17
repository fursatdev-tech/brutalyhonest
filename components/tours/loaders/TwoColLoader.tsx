import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  name1: string;
  name2: string;
  reverse?: boolean;
}

const TwoColLoader = ({ name1, name2, reverse = false }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div
        className={cn(
          "col-span-2 md:col-span-1 space-y-4",
          reverse && "order-last"
        )}
      >
        <p className="text-lg md:text-2xl font-bold">{name1}</p>

        <div className="shadow-sm p-6 rounded-2xl bg-primary-foreground">
          <Skeleton className="h-48 w-48 rounded-full mx-auto" />
        </div>
      </div>

      <div className="col-span-2 md:col-span-1 space-y-4">
        <p className="text-lg md:text-2xl font-bold">{name2}</p>

        <div className="shadow-sm p-6 rounded-2xl bg-primary-foreground flex gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-8 md:w-10 rounded-lg mx-auto" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TwoColLoader;
