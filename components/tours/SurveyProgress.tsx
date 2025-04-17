"use client";
import { parseAsInteger, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SurveyProgress = () => {
    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    return (
        <>
            {currentStep <= 15 && (
                <div className="flex flex-col justify-center items-center gap-6 px-6 lg:px-12 pt-6 lg:pt-12">
                    <div className="lg:block relative hidden w-[768px]">
                        <div className="flex justify-between">
                            {Array.from({ length: 15 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-3 h-3 rounded-full bg-border ${
                                        idx + 1 === currentStep
                                            ? "bg-primary"
                                            : currentStep >= idx + 1
                                            ? "bg-green-500"
                                            : ""
                                    }`}
                                />
                            ))}
                        </div>
                        <Separator className="top-[5px] -z-10 absolute" />
                    </div>

                    <Button className="px-8 bg-border text-foreground" disabled>
                        {currentStep} of 15
                    </Button>
                </div>
            )}
        </>
    );
};

export default SurveyProgress;
