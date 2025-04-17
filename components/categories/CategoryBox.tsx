"use client";

import qs from "query-string";
import { useRouter } from "next/navigation";
import { IconType } from "react-icons";

import { cn } from "@/lib/utils";

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  id: string;
  selected?: boolean;
  className?: string;
}

const CategoryBox = ({
  icon: Icon,
  label,
  selected,
  id,
  className,
}: CategoryBoxProps) => {
  const router = useRouter();

  const handleClick = () => {
    const query = { category: id };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-secondary transition cursor-pointer border-transparent text-secondary-foreground",
        selected && "border-b-secondary text-secondary",
        className
      )}
    >
      <Icon size={26} />
      <div className="font-medium text-xs md:text-sm">{label}</div>
    </div>
  );
};

export default CategoryBox;
