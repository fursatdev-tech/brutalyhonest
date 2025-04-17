import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import useFavorite from "@/util/hooks/useFavorite";

interface Props {
  listingId: string;
  favouriteIds: string[];
}

const FavouriteListingBtn = ({ listingId, favouriteIds }: Props) => {
  const { hasFavorited, toggleFavorite, isLoading } = useFavorite({
    listingId,
    favouriteIds,
  });

  return (
    <div onClick={toggleFavorite}>
      {hasFavorited ? (
        <Button
          variant="link"
          className="text-secondary"
          loading={isLoading}
          disabled={isLoading}
        >
          <FaHeart className="h-4 w-4 mr-1 text-primary" />
          Remove
        </Button>
      ) : (
        <Button
          variant="link"
          className="text-secondary"
          loading={isLoading}
          disabled={isLoading}
        >
          <FaRegHeart className="h-4 w-4 mr-1" />
          Save
        </Button>
      )}
    </div>
  );
};

export default FavouriteListingBtn;
