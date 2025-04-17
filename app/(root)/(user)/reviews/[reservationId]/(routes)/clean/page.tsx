"use client";
import { Separator } from "@/components/ui/separator";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import ReactStars from "react-stars";
import { GiVacuumCleaner } from "react-icons/gi";

import ReviewSubtitle from "@/components/profile/review/ReviewSubtitle";
import CleanOptions from "@/components/profile/review/CleanOptions";

const Clean = () => {
    const [params, setParams] = useQueryStates({
        cleanlinessRating: parseAsInteger.withDefault(0),
        host: parseAsString,
    });

    const rating = params.cleanlinessRating;
    const host = params.host;

    return (
        <>
            <GiVacuumCleaner size={80} />

            <div className="space-y-6">
                <h1 className="font-bold !text-3xl">
                    How clean was {host}&apos;s space?
                </h1>

                <p className="text-muted">
                    How well did they clean their home before you arrived?
                </p>

                <div>
                    <ReactStars
                        count={5}
                        size={48}
                        color2={"#008080"}
                        half={false}
                        value={rating}
                        onChange={(cleanlinessRating) =>
                            setParams((prev) => ({
                                ...prev,
                                cleanlinessRating,
                            }))
                        }
                    />

                    <ReviewSubtitle rating={rating} name="clean" />
                </div>

                {rating > 0 && (
                    <>
                        <Separator />

                        <CleanOptions />
                    </>
                )}
            </div>
        </>
    );
};

export default Clean;
