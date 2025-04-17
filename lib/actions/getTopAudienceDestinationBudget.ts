import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export const getTopAudienceDestinationBudget = async () => {
  try {
    const user = await currentUser();

    if (!user) return { destination: "NA", budget: 0, destinationCounts: [] };

    const hostClerkId = user.id;

    const surveys = await prismadb.toursSurveys.findMany({
      where: {
        hostClerkId,
      },
      select: {
        budget: true,
        destinations: {
          select: {
            destination: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const destinations = surveys.flatMap((survey) =>
      survey.destinations.map((d) => d.destination.name)
    );

    if (!destinations.length)
      return { destination: "NA", budget: 0, destinationCounts: [] };

    const destinationCounts = destinations.reduce<Record<string, number>>(
      (acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      },
      {}
    );

    let [mostRepeatedDestination] = Object.entries(destinationCounts).reduce(
      (a, b) => (a[1] > b[1] ? a : b)
    );

    const budgets = surveys
      .map((survey) => survey.budget)
      .sort((a, b) => a - b);

    const middle = Math.floor(budgets.length / 2);

    const medianBudget =
      budgets.length % 2 === 0
        ? (budgets[middle - 1] + budgets[middle]) / 2
        : budgets[middle];

    return {
      destination: mostRepeatedDestination,
      budget: medianBudget,
      destinationCounts,
    };
  } catch (error) {
    return { destination: "NA", budget: 0, destinationCounts: [] };
  }
};
