import { getTopAudienceDestinationBudget } from "@/lib/actions/getTopAudienceDestinationBudget";
import PopularDestinationsGraph, {
  DestinationCount,
} from "@/components/tours/graphs/PopularDestinationsGraph";

interface Props {
  qualified: number;
}

const TopAudienceStats = async ({ qualified }: Props) => {
  const { destination, budget, destinationCounts } =
    await getTopAudienceDestinationBudget();

  return (
    <>
      <div className="grid gap-6">
        <div className="shadow-sm p-6 rounded-2xl border text-center grid grid-cols-3 gap-6">
          <div className="col-span-3 md:col-span-1 space-y-2">
            <p className="text-3xl font-bold">{qualified}</p>
            <p className="font-medium text-muted-foreground text-sm">
              Qualified Survey Responses
            </p>
          </div>

          <div className="col-span-3 md:col-span-1 space-y-2">
            <p className="text-3xl font-bold">{destination}</p>
            <p className="font-medium text-muted-foreground text-sm">
              Top Destination
            </p>
          </div>

          <div className="col-span-3 md:col-span-1 space-y-1 md:space-y-2">
            <p className="text-3xl font-bold">${budget}</p>
            <p className="font-medium text-muted-foreground text-sm">
              Median Budget
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-lg md:text-2xl font-bold">Popular Destinations</p>
        </div>

        <div className="shadow-sm p-6 rounded-2xl text-center font-bold bg-primary-foreground">
          <PopularDestinationsGraph
            destinationCounts={destinationCounts as DestinationCount[]}
          />
        </div>
      </div>
    </>
  );
};

export default TopAudienceStats;
