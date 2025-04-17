import React from "react";
import { Skeleton } from "../ui/skeleton";

const ListCardLoader = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, idx) => (
        <div key={idx} className="col-span-1 space-y-3">
          <Skeleton className="h-auto w-full rounded-xl aspect-square" />
          <div className="flex gap-6">
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 w-10" />
          </div>
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </>
  );
};

export default ListCardLoader;
