import { format } from "date-fns";
import ReactStars from "react-stars";
import { useRouter } from "next/navigation";
import qs from "query-string";

import BImage from "@/util/Image";
import { SafeReservation } from "@/util/types";

interface Props {
  data: SafeReservation;
}

const ReviewBase = ({ data }: Props) => {
  const router = useRouter();

  const navigate = (rating: number) => {
    const url = qs.stringifyUrl(
      {
        url: `/reviews/${data.id}`,
        query: { overallRating: rating, host: data.listing.host.name },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="border-t border-b py-10 my-16 flex items-center justify-between">
      <div className="flex gap-3">
        <div className="relative aspect-square w-10 overflow-hidden rounded-md">
          <BImage
            className="h-full w-full"
            src={data.listing.imageUrl}
            alt="Listing"
          />
        </div>
        <div>
          <p className="font-semibold">Review your stay</p>
          <p className="flex gap-1 text-secondary-foreground text-sm">
            <span>{data.listing.title}</span>
            <span>&#x2022;</span>
            <span>
              {format(new Date(data.startDate), "LLL d yyyy")} -{" "}
              {format(new Date(data.endDate), "LLL d yyyy")}
            </span>
          </p>
        </div>
      </div>

      <ReactStars
        count={5}
        size={32}
        color2={"#008080"}
        half={false}
        value={data.review?.guestSatisfactionOverall || 0}
        onChange={(new_rating) => navigate(new_rating)}
      />
    </div>
  );
};

export default ReviewBase;
