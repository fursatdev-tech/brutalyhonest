import { isFirstTimeOnTours } from "@/lib/actions/isFirstTimeOnTours";
import GetStarted from "@/components/tours/GetStarted";
import ToursLanding from "@/components/tours/ToursLanding";

const Page = async () => {
  const isGetStartedDone = await isFirstTimeOnTours();

  return <>{isGetStartedDone ? <ToursLanding /> : <GetStarted />}</>;
};

export default Page;
