"use client";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import ReactStars from "react-stars";
import { IoDiamondOutline } from "react-icons/io5";

const Value = () => {
    const [params, setParams] = useQueryStates({
        valueRating: parseAsInteger.withDefault(0),
        host: parseAsString,
    });

    const rating = params.valueRating;
    const host = params.host;

    return (
        <>
            <IoDiamondOutline size={80} />

            <div className="space-y-6">
                <h1 className="font-bold !text-3xl">
                    Finally, was {host}&apos;s place worth what you paid?
                </h1>

                <p className="text-muted">
                    How was the value of {host}&apos;s place for the price?
                </p>

                <div>
                    <ReactStars
                        count={5}
                        size={48}
                        color2={"#008080"}
                        half={false}
                        value={rating}
                        onChange={(valueRating) =>
                            setParams((prev) => ({ ...prev, valueRating }))
                        }
                    />

                    <p className="font-semibold text-sm">
                        {!rating && "Select a rating"}
                        {rating === 1 && "Terrible deal"}
                        {rating === 2 && "Bad deal"}
                        {rating === 3 && "Okay deal"}
                        {rating === 4 && "Good deal"}
                        {rating === 5 && "Great deal"}
                    </p>
                </div>
            </div>
        </>
    );
};

export default Value;
