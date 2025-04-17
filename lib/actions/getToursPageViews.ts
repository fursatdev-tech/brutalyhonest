import { currentUser } from "@clerk/nextjs/server";

const PROJECT_ID = "51697";
const SHORT_ID = "Xhrco3Su";

export const getToursPageViews = async () => {
  const user = await currentUser();

  if (!user) return [];

  try {
    const apiUrl = `https://app.posthog.com/api/projects/${PROJECT_ID}/insights?short_id=${SHORT_ID}`;

    const responsePromise = fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_ANALYTICS_KEY}`,
      },
    });

    const [res] = await Promise.all([responsePromise]);
    const data = await res.json();

    const pageViews = data.results[0].result.filter(
      (item: any) =>
        item.breakdown_value.split("/").pop().split("?")[0] === user.username
    );

    const transformDataResult = transformData(pageViews);

    return transformDataResult;
  } catch (error) {
    return [];
  }
};

const transformData = (pageViews: IPageViews[]): ITransformedData[] => {
  if (!pageViews.length) return [];

  const graphData: ITransformedData[] = [];

  pageViews[0].labels.forEach((label, index) => {
    graphData.push({
      id: label,
      name: label.replace(/-2024/g, ""),
      value: pageViews[0].data[index],
    });
  });

  return graphData;
};

interface IPageViews {
  count: number;
  labels: string[];
  data: number[];
  breakdown_value: string;
}

export interface ITransformedData {
  id: string;
  name: string;
  value: number;
}
