import { parseAsInteger, useQueryState } from "nuqs";

import OptionsHeader from "@/components/profile/review/OptionsHeader";
import OptionsWrapper from "@/components/profile/review/OptionsWrapper";

const CleanOptions = () => {
    const [rating, setRating] = useQueryState(
        "cleanlinessRating",
        parseAsInteger.withDefault(0)
    );

    const below3Options = [
        {
            name: "Noticable smell",
            value: "smell",
        },
        {
            name: "Hair or pet hair",
            value: "hair",
        },
        {
            name: "Dirty bathroom",
            value: "bathroom",
        },
        {
            name: "Excessive clutter",
            value: "clutter",
        },
        {
            name: "Stains",
            value: "stains",
        },
        {
            name: "Messy kitchen",
            value: "kitchen",
        },
        {
            name: "Rubbish left behind",
            value: "rubbish",
        },
        {
            name: "Dirty or dusty",
            value: "dirt",
        },
        {
            name: "Something else",
            value: "other",
        },
    ];

    const above3Options = [
        {
            name: "Spotless frniture & linen",
            value: "spotless",
        },
        {
            name: "Pristine kitchen",
            value: "kitchen",
        },
        {
            name: "Free of clutter",
            value: "clutter",
        },
        {
            name: "Squeaky-clean bathroom",
            value: "bathroom",
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

            <OptionsWrapper
                options={options}
                queryParam="cleanlinessFeedback"
            />
        </div>
    );
};

export default CleanOptions;
