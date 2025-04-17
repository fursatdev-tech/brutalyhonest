import { PiCheckCircleFill } from "react-icons/pi";

import { cn } from "@/lib/utils";

interface Props {
  one?: boolean;
  two?: boolean;
  three?: boolean;
}

const ThreeStepProcess = ({
  one = false,
  two = false,
  three = false,
}: Props) => {
  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        <PiCheckCircleFill
          className={cn(
            "text-gray-200 w-6 h-6 min-w-[24px]",
            one && "text-primary"
          )}
        />

        <div>
          <p className="font-medium">Sign up on BrutalyHonest Tours</p>
          <p className="font-light text-sm">{one ? "Done!" : ""}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <PiCheckCircleFill
          className={cn(
            "text-gray-200 w-6 h-6 min-w-[24px]",
            two && "text-primary"
          )}
        />

        <div>
          <p className="font-medium">Survey your Audience</p>
          <p className="font-light text-sm">
            {two
              ? "Done!"
              : "Understand your audience and their travel preferences"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <PiCheckCircleFill
          className={cn(
            "text-gray-200 w-6 h-6 min-w-[24px]",
            three && "text-primary"
          )}
        />

        <div>
          <p className="font-medium">Qualify to Host a Trip</p>
          <p className="font-light text-sm">
            {three ? "Done!" : "Collect 50 qualified survey responses"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeStepProcess;
