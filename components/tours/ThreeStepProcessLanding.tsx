"use client";
import {
  TbCircleNumber1,
  TbCircleNumber2,
  TbCircleNumber3,
  TbCircle,
  TbCircleCheck,
} from "react-icons/tb";
import { useState } from "react";

import { cn } from "@/lib/utils";

const ThreeStepProcessLanding = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [activeSubStep, setActiveSubStep] = useState(1);

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        {activeStep >= 2 ? (
          <TbCircleCheck className="text-primary w-6 h-6 min-w-[24px]" />
        ) : (
          <TbCircleNumber1
            className={cn("w-6 h-6 min-w-[24px] text-primary")}
          />
        )}

        <div className="space-y-3">
          <p className={cn("font-medium", activeStep === 1 && "text-primary")}>
            Survey
          </p>
          {activeStep === 1 && (
            <>
              <div className={cn("flex gap-2 items-center text-sm")}>
                {activeSubStep >= 2 ? (
                  <TbCircleCheck className="text-primary" size={18} />
                ) : (
                  <TbCircle className="text-primary" size={18} />
                )}
                <p
                  className={cn(
                    "font-medium",
                    activeSubStep === 1 && "text-primary"
                  )}
                >
                  Start Surveying
                </p>
              </div>

              <div
                className={cn(
                  "flex gap-2 items-center text-sm",
                  activeSubStep >= 2 && "text-primary"
                )}
              >
                <TbCircle className="" size={18} />
                <p className="font-medium"> 50 Responses</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <TbCircleNumber2
          className={cn(
            "text-muted-foreground w-6 h-6 min-w-[24px]",
            activeStep === 2 && "text-primary"
          )}
        />

        <div>
          <p className={cn("font-medium", activeStep === 2 && "text-primary")}>
            Review
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <TbCircleNumber3
          className={cn(
            "text-muted-foreground w-6 h-6 min-w-[24px]",
            activeStep === 3 && "text-primary"
          )}
        />

        <div>
          <p className={cn("font-medium", activeStep === 3 && "text-primary")}>
            Request
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeStepProcessLanding;
