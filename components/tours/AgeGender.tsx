import BarGraph from "@/components/tours/graphs/BarGraph";
import { getAgeData } from "@/lib/actions/getAgeData";
import PieGraph from "@/components/tours/graphs/PieGraph";
import { getGenderData } from "@/lib/actions/getGenderData";

const AgeGender = async () => {
  const { ageData } = await getAgeData();

  const { genderData } = await getGenderData();

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-2 md:col-span-1 space-y-4">
        <p className="text-lg md:text-2xl font-bold">Age</p>

        <div className="shadow-sm p-6 rounded-2xl text-center font-bold bg-primary-foreground">
          <BarGraph data={ageData} />
        </div>
      </div>

      <div className="col-span-2 md:col-span-1 space-y-4">
        <p className="text-lg md:text-2xl font-bold">Gender</p>

        <div className="shadow-sm p-6 rounded-2xl text-center font-bold bg-primary-foreground">
          <PieGraph data={genderData} />
        </div>
      </div>
    </div>
  );
};

export default AgeGender;
