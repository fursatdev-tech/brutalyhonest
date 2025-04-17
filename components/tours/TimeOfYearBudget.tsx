import { getTimeOfYearData } from "@/lib/actions/getTimeOfYearData";
import PieGraph from "@/components/tours/graphs/PieGraph";
import { getBudgetData } from "@/lib/actions/getBudgetData";
import BarGraph from "@/components/tours/graphs/BarGraph";

const TimeOfYearBudget = async () => {
  const { toeData } = await getTimeOfYearData();

  const { budgetData } = await getBudgetData();

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-2 md:col-span-1 space-y-4">
        <p className="text-lg md:text-2xl font-bold">Time of Year</p>

        <div className="shadow-sm p-6 rounded-2xl text-center font-bold bg-primary-foreground">
          <PieGraph data={toeData} />
        </div>
      </div>

      <div className="col-span-2 md:col-span-1 space-y-4">
        <p className="text-lg md:text-2xl font-bold">Budget</p>

        <div className="shadow-sm p-6 rounded-2xl text-center font-bold bg-primary-foreground">
          <BarGraph data={budgetData} />
        </div>
      </div>
    </div>
  );
};

export default TimeOfYearBudget;
