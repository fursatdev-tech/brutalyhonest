import { currentUser } from "@clerk/nextjs/server";
import { TbEye } from "react-icons/tb";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import ThreeStepProcessLanding from "@/components/tours/ThreeStepProcessLanding";
import ToursCopyLink from "@/components/tours/ToursCopyLink";
import SurveyAudience from "@/components/tours/SurveyAudience";

const ToursLanding = async () => {
  const user = await currentUser();
  const username = user?.username || "";

  const link = `/survey/${username}`;

  const fullLink = `${process.env.META_URL}${link}`;

  return (
    <div className="space-y-4">
      <p className="text-3xl font-bold">Hello, {user?.firstName}</p>

      <div className="bg-white drop-shadow-sm p-6 rounded-2xl border">
        <div className="grid grid-cols-3 gap-6 divide-y-2 lg:divide-y-0">
          <div className="space-y-6 col-span-3 lg:col-span-1">
            <p className="font-bold text-xl">3 steps to success</p>

            <ThreeStepProcessLanding />
          </div>

          <div className="col-span-3 lg:col-span-2 space-y-6 pt-6 lg:pt-0">
            <p className="font-bold text-2xl">Survey Your Audience</p>
            <p>
              Share the link below with your community so they can help you plan
              the perfect trip. All the data collected is yours to download and
              keep.
            </p>

            <div className="flex items-center gap-6 flex-wrap">
              <ToursCopyLink link={fullLink} username={username} />

              <Link target="_blank" href={link}>
                <Button className="w-fit" variant="outline" size="lg">
                  Preview Survey <TbEye className="ms-3 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SurveyAudience />
    </div>
  );
};

export default ToursLanding;
