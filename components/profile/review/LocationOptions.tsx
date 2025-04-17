import { parseAsInteger, useQueryState } from "nuqs";

import OptionsHeader from "@/components/profile/review/OptionsHeader";
import OptionsWrapper from "@/components/profile/review/OptionsWrapper";

const LocationOptions = () => {
    const [rating, setRating] = useQueryState(
        "locationRating",
        parseAsInteger.withDefault(0)
    );

    const below3Options = [
        {
            name: "Inconvenient location",
            value: "location",
        },
        {
            name: "Bland surroundings",
            value: "surroundings",
        },
        {
            name: "Not much to do",
            value: "activity",
        },
        {
            name: "Not private",
            value: "private",
        },
        {
            name: "Noisy",
            value: "peace",
        },
        {
            name: "Something else",
            value: "other",
        },
    ];

    const above3Options = [
        {
            name: "Private",
            value: "private",
        },
        {
            name: "Great restaurants",
            value: "restaurants",
        },
        {
            name: "Lots to do",
            value: "activity",
        },
        {
            name: "Peaceful",
            value: "peace",
        },
        {
            name: "Walkable",
            value: "walkable",
        },
        {
            name: "Beautiful surroundings",
            value: "surroundings",
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

            <OptionsWrapper options={options} queryParam="locationFeedback" />
        </div>
    );
};

export default LocationOptions;
