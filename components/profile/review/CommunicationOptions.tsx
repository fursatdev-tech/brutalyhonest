import { parseAsInteger, useQueryState } from "nuqs";

import OptionsHeader from "@/components/profile/review/OptionsHeader";
import OptionsWrapper from "@/components/profile/review/OptionsWrapper";

const CommunicationOptions = () => {
    const [rating, setRating] = useQueryState(
        "communicationRating",
        parseAsInteger.withDefault(0)
    );

    const below3Options = [
        {
            name: "Missing house instructions",
            value: "instructions",
        },
        {
            name: "Not helpful",
            value: "helpful",
        },
        {
            name: "Slow to respond",
            value: "respond",
        },
        {
            name: "Excessive checkout tasks",
            value: "checkout",
        },
        {
            name: "Inconsiderate",
            value: "inconsiderate",
        },
        {
            name: "Something else",
            value: "other",
        },
    ];

    const above3Options = [
        {
            name: "Friendly",
            value: "friendly",
        },
        {
            name: "Proactive",
            value: "proactive",
        },
        {
            name: "Local recommendations",
            value: "recommendations",
        },
        {
            name: "Always responsive",
            value: "respond",
        },
        {
            name: "Helpful instructions",
            value: "instructions",
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
                queryParam="communicationFeedback"
            />
        </div>
    );
};

export default CommunicationOptions;
