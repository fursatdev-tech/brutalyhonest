import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { CiLock } from "react-icons/ci";

import ToursCopyLink from "@/components/tours/ToursCopyLink";
import { getQualifiedAndTotalResponses } from "@/lib/actions/getQualifiedAndTotalResponses";
import { getUniqueEmailsSurvey } from "@/lib/actions/getUniqueEmailsSurvey";
import TopAudienceStats from "@/components/tours/TopAudienceStats";
import { Suspense } from "react";
import TopAudienceStatsLoader from "@/components/tours/loaders/TopAudienceStatsLoading";
import TimeOfYearBudget from "@/components/tours/TimeOfYearBudget";
import TwoColLoader from "@/components/tours/loaders/TwoColLoader";
import AgeGender from "@/components/tours/AgeGender";

const Audience = async () => {
  const user = await currentUser();
  const username = user?.username || "";

  const link = `/survey/${username}`;
  const fullLink = `${process.env.META_URL}${link}`;

  const { qualified, total } = await getQualifiedAndTotalResponses();
  const { emails } = await getUniqueEmailsSurvey();

  return (
    <div className="space-y-10 pb-28">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 md:col-span-1 shadow-sm p-6 rounded-2xl border text-center font-bold">
          <div className="relative w-full h-64">
            <Image
              src="/images/tour/audience.svg"
              alt="Audience"
              fill
              className="object-contain"
            />
          </div>

          <p className="text-3xl">{total}</p>
          <p>Total Audience</p>
        </div>

        <div className="col-span-2 md:col-span-1 space-y-6">
          <div className="shadow-sm p-6 rounded-2xl border space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold">{emails}</span> emails
              </p>

              <ToursCopyLink
                link={fullLink}
                username={username}
                varient="link"
              />
            </div>
            <p className="font-bold">Survey Responses</p>
            <p className="text-sm">
              Survey your audience to understand where they want to go, their
              budget, preferred travel dates, and more.
            </p>
          </div>

          <div className="shadow-sm p-6 rounded-2xl border space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-sm ">
                <span className="font-bold">1</span> emails
              </p>

              <CiLock size={18} />
            </div>
            <p className="font-bold">Email Collection</p>
            <p className="text-sm">
              Submit your first trip request to gain access to your email
              collection link. This tool is used to continue growing your
              audience list after surveying.
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<TopAudienceStatsLoader />}>
        <TopAudienceStats qualified={qualified} />
      </Suspense>

      <Suspense fallback={<TwoColLoader name1="Time of Year" name2="Budget" />}>
        <TimeOfYearBudget />
      </Suspense>

      <Suspense fallback={<TwoColLoader name1="Age" name2="Gender" reverse />}>
        <AgeGender />
      </Suspense>
    </div>
  );
};

export default Audience;
