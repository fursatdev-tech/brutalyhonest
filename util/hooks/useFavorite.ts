import axios from "axios";
import { MouseEvent, useCallback, useMemo, useState } from "react";

import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface UseFavoriteProps {
  listingId: string;
  favouriteIds: string[];
}

const useFavorite = ({ listingId, favouriteIds }: UseFavoriteProps) => {
  const user = useUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const hasFavorited = useMemo(() => {
    return favouriteIds.includes(listingId);
  }, [favouriteIds, listingId]);

  const addOrRemoveFavourite = useCallback(async () => {
    if (hasFavorited) return await axios.delete(`/api/favourites/${listingId}`);

    return await axios.post(`/api/favourites/${listingId}`);
  }, [hasFavorited, listingId]);

  const toggleFavorite = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      setIsLoading(true);
      e.preventDefault();
      e.stopPropagation();

      if (!user) return;

      try {
        await addOrRemoveFavourite();

        router.refresh();

        toast({
          description: `${
            hasFavorited ? "Removed from" : "Added to"
          } favourites.`,
          duration: 3000,
        });
      } catch (error: any) {
        toast({
          description: `${error?.data?.message}` || "Something went wrong",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user, addOrRemoveFavourite, router, hasFavorited]
  );

  return {
    hasFavorited,
    toggleFavorite,
    isLoading,
  };
};

export default useFavorite;
