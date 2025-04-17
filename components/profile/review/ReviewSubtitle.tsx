interface Props {
  rating: number;
  name: string;
}

const ReviewSubtitle = ({ rating, name }: Props) => {
  return (
    <p className="font-semibold text-sm">
      {!rating && "Select a rating"}
      {rating === 1 && `Not at all ${name}`}
      {rating === 2 && `Not very ${name}`}
      {rating === 3 && `Fairly ${name}`}
      {rating === 4 && `Very ${name}`}
      {rating === 5 && `Extremely ${name}`}
    </p>
  );
};

export default ReviewSubtitle;
