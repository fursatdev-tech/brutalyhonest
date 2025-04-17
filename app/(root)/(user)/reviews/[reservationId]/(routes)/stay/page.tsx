"use client";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import ReactStars from "react-stars";
import { TbHome } from "react-icons/tb";

const Stay = () => {
    const [params, setParams] = useQueryStates({
        overallRating: parseAsInteger.withDefault(0),
        host: parseAsString,
    });

    const rating = params.overallRating;
    const host = params.host;

    return (
        <>
            <TbHome size={80} />

            <div className="space-y-6">
                <h1 className="font-bold !text-3xl">How was your stay?</h1>

                <p className="text-muted">
                    Let us know how your overall experience was with {host} and
                    their place.
                </p>

                <div>
                    <ReactStars
                        count={5}
                        size={48}
                        color2={"#008080"}
                        half={false}
                        value={rating}
                        onChange={(overallRating) =>
                            setParams((prev) => ({ ...prev, overallRating }))
                        }
                    />

                    <p className="font-semibold text-sm">
                        {!rating && "Select a rating"}
                        {rating === 1 && "Terrible"}
                        {rating === 2 && "Bad"}
                        {rating === 3 && "Okay"}
                        {rating === 4 && "Good"}
                        {rating === 5 && "Great"}
                    </p>
                </div>
            </div>
        </>
    );
};

export default Stay;
