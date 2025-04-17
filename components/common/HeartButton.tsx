"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import useFavorite from "@/util/hooks/useFavorite";
import { cn } from "@/lib/utils";

interface HeartButtonProps {
  listingId: string;
  favouriteIds: string[];
}

const HeartButton = ({ listingId, favouriteIds }: HeartButtonProps) => {
  const { hasFavorited, toggleFavorite, isLoading } = useFavorite({
    listingId,
    favouriteIds,
  });

  return (
    <div
      onClick={toggleFavorite}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      <AiOutlineHeart
        size={28}
        className={cn(
          "fill-background absolute -top-[2px] -right-[2px]",
          isLoading && "animate-bounce"
        )}
      />
      <AiFillHeart
        size={24}
        className={cn(
          "fill-secondary-foreground",
          hasFavorited && "fill-primary",
          isLoading && "animate-bounce"
        )}
      />
    </div>
  );
};

export default HeartButton;
