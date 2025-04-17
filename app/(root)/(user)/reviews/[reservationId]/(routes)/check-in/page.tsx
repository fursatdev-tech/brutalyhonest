"use client";
import { Separator } from "@/components/ui/separator";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import ReactStars from "react-stars";
import { BsHouseCheck } from "react-icons/bs";

import CheckInOptions from "@/components/profile/review/CheckInOptions";
import ReviewSubtitle from "@/components/profile/review/ReviewSubtitle";

const CheckIn = () => {
    const [params, setParams] = useQueryStates({
        checkinRating: parseAsInteger.withDefault(0),
        host: parseAsString,
    });

    const rating = params.checkinRating;
    const host = params.host;

    return (
        <>
            <BsHouseCheck size={80} />

            <div className="space-y-6">
                <h1 className="font-bold !text-3xl">
                    How was check-in at {host}&apos;s place?
                </h1>

                <p className="text-muted">
                    How easy was it to find the place and get inside?
                </p>

                <div>
                    <ReactStars
                        count={5}
                        size={48}
                        color2={"#008080"}
                        half={false}
                        value={rating}
                        onChange={(checkinRating) =>
                            setParams((prev) => ({ ...prev, checkinRating }))
                        }
                    />

                    <ReviewSubtitle rating={rating} name="easy" />
                </div>

                {rating > 0 && (
                    <>
                        <Separator />

                        <CheckInOptions />
                    </>
                )}
            </div>
        </>
    );
};

export default CheckIn;
