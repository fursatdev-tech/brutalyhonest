"use client";
import { useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import Step1 from "@/components/tours/survey-form-steps/Step1";
import Step2 from "@/components/tours/survey-form-steps/Step2";
import Step3 from "@/components/tours/survey-form-steps/Step3";
import Step4 from "@/components/tours/survey-form-steps/Step4";
import Step5 from "@/components/tours/survey-form-steps/Step5";
import Step6 from "@/components/tours/survey-form-steps/Step6";
import Step7 from "@/components/tours/survey-form-steps/Step7";
import Step8 from "@/components/tours/survey-form-steps/Step8";
import Step9 from "@/components/tours/survey-form-steps/Step9";
import Step10 from "@/components/tours/survey-form-steps/Step10";
import Step11 from "@/components/tours/survey-form-steps/Step11";
import Step12 from "@/components/tours/survey-form-steps/Step12";
import Step13 from "@/components/tours/survey-form-steps/Step13";
import Step14 from "@/components/tours/survey-form-steps/Step14";
import Step15 from "@/components/tours/survey-form-steps/Step15";
import Step16 from "@/components/tours/survey-form-steps/Step16";
import { SafeToursSurveys } from "@/util/types";

const SurveyForm = () => {
    const [data, setData] = useState<SafeToursSurveys>({} as SafeToursSurveys);

    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    const GetStepWiseForm = () => {
        switch (currentStep) {
            case 1:
                return <Step1 data={data} setData={setData} />;

            case 2:
                return <Step2 data={data} setData={setData} />;

            case 3:
                return <Step3 data={data} setData={setData} />;

            case 4:
                return <Step4 data={data} setData={setData} />;

            case 5:
                return <Step5 data={data} setData={setData} />;

            case 6:
                return <Step6 data={data} setData={setData} />;

            case 7:
                return <Step7 data={data} setData={setData} />;

            case 8:
                return <Step8 data={data} setData={setData} />;

            case 9:
                return <Step9 data={data} setData={setData} />;

            case 10:
                return <Step10 data={data} setData={setData} />;

            case 11:
                return <Step11 data={data} setData={setData} />;

            case 12:
                return <Step12 data={data} setData={setData} />;

            case 13:
                return <Step13 data={data} setData={setData} />;

            case 14:
                return <Step14 data={data} setData={setData} />;

            case 15:
                return <Step15 data={data} setData={setData} />;

            case 16:
                return <Step16 />;

            default:
                return <Step1 data={data} setData={setData} />;
        }
    };

    return <GetStepWiseForm />;
};

export default SurveyForm;
