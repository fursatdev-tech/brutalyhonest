import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { AiOutlineQuestionCircle } from "react-icons/ai";

import { getQualifiedAndTotalResponses } from "@/lib/actions/getQualifiedAndTotalResponses";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SurveyAudience = async () => {
  const { qualified, total } = await getQualifiedAndTotalResponses();

  const tier =
    qualified >= 300 ? "expert" : qualified >= 100 ? "experienced" : "starter";

  const max = qualified >= 50 ? (qualified >= 100 ? 300 : 100) : 50;

  return (
    <div className="bg-white drop-shadow-sm p-6 rounded-2xl border space-y-6">
      <p className="font-bold text-xl">Audience</p>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 lg:col-span-2 shadow hover:shadow-lg transition cursor-pointer rounded-2xl p-6">
          <div className="flex items-center">
            <Link href="/hosting/tours/audience" className="space-y-3">
              <p className="font-medium">Qualified Responses</p>

              <p className="text-4xl font-bold"> {qualified} / 50</p>

              <p className="text-sm">
                Qualified respondents are age 18+ with a travel budget of
                $1,000+
              </p>
            </Link>
          </div>
        </div>

        <Link
          href="/hosting/tours/audience"
          className="col-span-3 lg:col-span-1 shadow rounded-2xl p-6 space-y-3 hover:shadow-lg transition cursor-pointer"
        >
          <p className="font-medium">Total Responses</p>

          <p className="text-4xl font-bold">{total}</p>
        </Link>
      </div>

      <div className="space-y-3">
        <p className="font-medium flex items-center gap-3">
          Your Itinerary Tier
          <Popover>
            <PopoverTrigger>
              <AiOutlineQuestionCircle />
            </PopoverTrigger>
            <PopoverContent className="text-sm">
              Itinerary Tiers are unlocked by surveying your audience.
            </PopoverContent>
          </Popover>
        </p>

        <div className="flex items-center justify-between">
          <p className="uppercase font-bold text-3xl text-primary">{tier}</p>

          <Link href="tours/itinararies">
            <Button className="capitalize" variant="link">
              View {tier} Itineraries
              <IoChevronForward className="w-4 h-4 ms-2" />
            </Button>
          </Link>
        </div>

        <Progress value={qualified} max={max} className="h-2" />
      </div>
    </div>
  );
};

export default SurveyAudience;
