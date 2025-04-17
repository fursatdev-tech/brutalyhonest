import { parseAsInteger, useQueryState } from "nuqs";

import OptionsHeader from "@/components/profile/review/OptionsHeader";
import OptionsWrapper from "@/components/profile/review/OptionsWrapper";

const AccuracyOptions = () => {
    const [rating, setRating] = useQueryState(
        "accuracyRating",
        parseAsInteger.withDefault(0)
    );

    const below3Options = [
        {
            name: "Problem with amenity",
            value: "amenity",
        },
        {
            name: "Unexpected rules",
            value: "rules",
        },
        {
            name: "Unexpected noise",
            value: "noise",
        },
        {
            name: "Smaller than expected",
            value: "smaller",
        },
        {
            name: "Didn't match the photos",
            value: "photos",
        },
        {
            name: "Inaccurate location",
            value: "location",
        },
        {
            name: "Unexpected fees",
            value: "fees",
        },
        {
            name: "Needs maintenance",
            value: "maintenance",
        },
        {
            name: "Something else",
            value: "other",
        },
    ];

    const above3Options = [
        {
            name: "Looked like the photos",
            value: "photos",
        },
        {
            name: "Had listed amenities & services",
            value: "amenity",
        },
        {
            name: "Matched the description",
            value: "matched",
        },
        {
            name: "Something else",
            value: "other",
        },
    ];

    const isPositive = rating > 3;

    const options = isPositive ? above3Options : below3Options;

    return (
        <div className="space-y-4">
            <OptionsHeader isPositive={isPositive} />

            <OptionsWrapper options={options} queryParam="accuracyFeedback" />
        </div>
    );
};

export default AccuracyOptions;
