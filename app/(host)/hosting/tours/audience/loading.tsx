import TopAudienceStatsLoader from "@/components/tours/loaders/TopAudienceStatsLoading";
import TwoColLoader from "@/components/tours/loaders/TwoColLoader";

const loading = () => {
  return (
    <div className="space-y-10 pb-28">
      <TopAudienceStatsLoader />
      <TwoColLoader name1="Time of Year" name2="Budget" />
      <TwoColLoader name1="Age" name2="Gender" reverse />
    </div>
  );
};

export default loading;
