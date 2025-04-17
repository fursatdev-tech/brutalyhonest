import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { parseAsInteger, useQueryState } from "nuqs";

interface Props {
    prev?: number;
    submit?: boolean;
    loading?: boolean;
    fixed?: boolean;
}

const SurveyFormFooter = ({
    prev,
    submit = false,
    loading = false,
    fixed = false,
}: Props) => {
    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    return (
        <div
            className={cn(
                "flex items-center justify-between bg-primary rounded-b-xl px-4 py-1 w-full z-50",
                fixed && "absolute bottom-0",
                !prev && "justify-end"
            )}
        >
            {prev && (
                <Button
                    type="button"
                    className="font-normal uppercase tracking-widest"
                    onClick={() => setCurrentStep(prev)}
                >
                    <FaArrowLeftLong className="mr-2" /> Previous
                </Button>
            )}
            <Button
                type="submit"
                className="font-normal uppercase tracking-widest"
                loading={loading}
                disabled={loading}
            >
                {submit ? (
                    "Submit"
                ) : (
                    <>
                        Next <FaArrowRightLong className="ms-2" />
                    </>
                )}
            </Button>
        </div>
    );
};

export default SurveyFormFooter;
