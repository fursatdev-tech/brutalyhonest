import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <Container>
      <div className="grid grid-cols-12 gap-8">
        {Array.from({ length: 24 }).map((_, i) => (
          <Skeleton
            className="h-40 w-full rounded-lg col-span-12 md:col-span-4 lg:col-span-2 xl:col-span-2"
            key={i}
          />
        ))}
      </div>
    </Container>
  );
};

export default loading;
