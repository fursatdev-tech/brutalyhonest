import { FaStar } from "react-icons/fa";

interface RatingProps {
  wrapperClass?: string;
  rating: number | null;
  noRatingText?: string;
}

const RatingC = ({
  rating,
  wrapperClass = "flex items-center",
  noRatingText = "New",
}: RatingProps) => {
  return (
    <div className={wrapperClass}>
      <FaStar size={14} className="text-secondary" />
      &nbsp;
      <span className="ms-1 text-secondary">
        {rating
          ? (rating === Math.round(rating) ? `${rating}.0` : rating) ||
            noRatingText
          : noRatingText}
      </span>
    </div>
  );
};

export default RatingC;
