import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

import OptionTags from "@/components/profile/review/OptionTags";

interface Props {
    options: { name: string; value: string }[];
    queryParam: string;
}

const OptionsWrapper = ({ options = [], queryParam }: Props) => {
    const [feedback, setFeedback] = useQueryState(
        queryParam,
        parseAsArrayOf(parseAsString).withDefault([])
    );

    const changeFeedback = (value: string) => {
        if (feedback.includes(value))
            return setFeedback((prev) => prev.filter((item) => item !== value));

        setFeedback((prev) => [...prev, value]);
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {options.map(({ name, value }, idx) => (
                <div key={idx} onClick={() => changeFeedback(value)}>
                    <OptionTags
                        name={name}
                        selected={feedback.includes(value)}
                    />
                </div>
            ))}
        </div>
    );
};

export default OptionsWrapper;
