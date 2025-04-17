import { parseAsInteger, useQueryState } from "nuqs";

import OptionsHeader from "@/components/profile/review/OptionsHeader";
import OptionsWrapper from "@/components/profile/review/OptionsWrapper";

const CheckInOptions = () => {
    const [rating, setRating] = useQueryState(
        "checkinRating",
        parseAsInteger.withDefault(0)
    );

    const below3Options = [
        {
            name: "Had to wait",
            value: "wait",
        },
        {
            name: "Unclear instructions",
            value: "instructions",
        },
        {
            name: "Trouble with lock",
            value: "lock",
        },
        {
            name: "Unresponsive Host",
            value: "host",
        },
        {
            name: "Hard to get inside",
            value: "inside",
        },
        {
            name: "Hard to locate",
            value: "locate",
        },
        {
            name: "Something else",
            value: "other",
        },
    ];

    const above3Options = [
        {
            name: "Easy to get inside",
            value: "inside",
        },
        {
            name: "Responsive Host",
            value: "host",
        },
        {
            name: "Easy to find",
            value: "locate",
        },
        {
            name: "Clear instructions",
            value: "instructions",
        },
        {
            name: "Flexible check-in",
            value: "flexible",
        },
        {
            name: "Felt right at home",
            value: "home",
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

            <OptionsWrapper options={options} queryParam="checkinFeedback" />
        </div>
    );
};

export default CheckInOptions;
