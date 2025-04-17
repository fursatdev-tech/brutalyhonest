import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

const PROJECT_ID = "51697";
const SHORT_ID = "jEu1m2xW";

export const getListingsPageViews = async () => {
  const user = await currentUser();

  if (!user) return [];

  try {
    const apiUrl = `https://app.posthog.com/api/projects/${PROJECT_ID}/insights?short_id=${SHORT_ID}`;

    const responsePromise = fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_ANALYTICS_KEY}`,
      },
    });

    const foundListingsPromise = prismadb.listing.findMany({
      where: {
        OR: [
          {
            host: {
              user: {
                clerkId: user.id,
              },
            },
          },
          {
            coHost: {
              some: {
                host: {
                  user: {
                    clerkId: user.id,
                  },
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
      },
    });

    const [res, foundListings] = await Promise.all([
      responsePromise,
      foundListingsPromise,
    ]);
    const data = await res.json();

    const listingIds = new Set(foundListings.map((listing) => listing.id));

    const pageViews = data.results[0].result.filter((item: any) =>
      listingIds.has(item.breakdown_value.split("/").pop())
    );

    const transformDataResult = transformData(pageViews, foundListings);

    return transformDataResult;
  } catch (error) {
    return [];
  }
};

const transformData = (
  pageViews: IPageViews[],
  foundListings: IFoundListings[]
): ITransformedData[] => {
  if (!pageViews.length) return [];

  const listingNameMap = new Map<string, string>(
    foundListings.map((listing) => [listing.id, listing.title])
  );

  const graphData: ITransformedData[] = [];

  const length = 45;

  pageViews.forEach((item) => {
    const listingId = item.breakdown_value.split("/").pop()!;

    let listingName = listingNameMap.get(listingId) || "NA";

    listingName =
      listingName.length > length
        ? listingName.substring(0, 45) + "..."
        : listingName;

    const existingListing = graphData.find(
      (listing) => listing.id === listingName
    );

    if (existingListing) return (existingListing.value += item.count);

    graphData.push({ name: listingName, value: item.count, id: listingId });
  });

  const sortedGraphData = graphData.sort((a, b) => b.value - a.value);

  return sortedGraphData;
};

interface IPageViews {
  count: number;
  labels: string[];
  breakdown_value: string;
}

export interface ITransformedData {
  id: string;
  name: string;
  value: number;
}

interface IFoundListings {
  id: string;
  title: string;
}
