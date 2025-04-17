import PageViewGraph from "@/components/dashboard/graphs/PageViewGraph";
import Container from "@/components/ui/container";
import { getToursPageViews } from "@/lib/actions/getToursPageViews";
import LineGraph from "@/components/dashboard/graphs/LineGraph";
import AreaGraph from "@/components/dashboard/graphs/AreaGraph";
import { getListingsPageViews } from "@/lib/actions/getListingsPageViews";
import { getHostRevenueData } from "@/lib/actions/getHostRevenueData";

const HostingRoot = async () => {
  const listingViewsPromise = getListingsPageViews();
  const surveyViewsPromise = getToursPageViews();
  const revenueDataPromise = getHostRevenueData();

  const [listingViews, surveyViews, revenueData] = await Promise.all([
    listingViewsPromise,
    surveyViewsPromise,
    revenueDataPromise,
  ]);

  return (
    <Container className="pb-28 space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 md:col-span-1 shadow-sm rounded-xl border p-4 md:p-6">
          <p className="font-medium md:text-lg">Listings views</p>

          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-primary-light">
              {listingViews.reduce((acc, curr) => acc + curr.value, 0)}
            </p>
            <p className="text-sm text-muted-foreground mb-1">
              Total views (last 7 days)
            </p>
          </div>

          <PageViewGraph data={listingViews} />
        </div>

        <div className="col-span-3 md:col-span-2 shadow-sm rounded-xl border p-4 md:p-6">
          <p className="font-medium md:text-lg">Tours views</p>

          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-primary-light">
              {surveyViews.reduce((acc, curr) => acc + curr.value, 0)}
            </p>
            <p className="text-sm text-muted-foreground mb-1">
              Total views (last 14 days)
            </p>
          </div>

          <LineGraph data={surveyViews} />
        </div>
      </div>

      <div className="shadow-sm rounded-xl border p-4 md:p-6">
        <p className="font-medium md:text-lg">Performance</p>
        <p className="text-sm text-muted-foreground">
          Comparison between Sales and Earnings
        </p>

        <AreaGraph data={revenueData} />
      </div>
    </Container>
  );
};

export default HostingRoot;
