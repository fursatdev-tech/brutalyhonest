"use client";
import { Separator } from "@/components/ui/separator";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import ReactStars from "react-stars";
import { CiLocationOn } from "react-icons/ci";

import ReviewSubtitle from "@/components/profile/review/ReviewSubtitle";
import LocationOptions from "@/components/profile/review/LocationOptions";

const Location = () => {
    const [params, setParams] = useQueryStates({
        locationRating: parseAsInteger.withDefault(0),
        host: parseAsString,
    });

    const rating = params.locationRating;
    const host = params.host;

    return (
        <>
            <CiLocationOn size={80} />

            <div className="space-y-6">
                <h1 className="font-bold !text-3xl">
                    What did you think of the location?
                </h1>

                <p className="text-muted">
                    How did you feel about the area and neighbourhood?
                </p>

                <div>
                    <ReactStars
                        count={5}
                        size={48}
                        color2={"#008080"}
                        half={false}
                        value={rating}
                        onChange={(locationRating) =>
                            setParams((prev) => ({ ...prev, locationRating }))
                        }
                    />

                    <ReviewSubtitle rating={rating} name="satisfied" />
                </div>

                {rating > 0 && (
                    <>
                        <Separator />

                        <LocationOptions />
                    </>
                )}
            </div>
        </>
    );
};

export default Location;
