"use client";
import { Separator } from "@/components/ui/separator";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import ReactStars from "react-stars";
import { GoTasklist } from "react-icons/go";

import ReviewSubtitle from "@/components/profile/review/ReviewSubtitle";
import AccuracyOptions from "@/components/profile/review/AccuracyOptions";

const Accuracy = () => {
    const [params, setParams] = useQueryStates({
        accuracyRating: parseAsInteger.withDefault(0),
        host: parseAsString,
    });

    const rating = params.accuracyRating;
    const host = params.host;

    return (
        <>
            <GoTasklist size={80} />

            <div className="space-y-6">
                <h1 className="font-bold !text-3xl">
                    How accurately did {host} describe their place?
                </h1>

                <p className="text-muted">
                    Did {host}&apos;s place meet your expectations based on the
                    listing?
                </p>

                <div>
                    <ReactStars
                        count={5}
                        size={48}
                        color2={"#008080"}
                        half={false}
                        value={rating}
                        onChange={(accuracyRating) =>
                            setParams((prev) => ({ ...prev, accuracyRating }))
                        }
                    />

                    <ReviewSubtitle rating={rating} name="accurate" />
                </div>

                {rating > 0 && (
                    <>
                        <Separator />

                        <AccuracyOptions />
                    </>
                )}
            </div>
        </>
    );
};

export default Accuracy;
