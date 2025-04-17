import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export const getBudgetData = async () => {
  try {
    const user = await currentUser();

    if (!user) return { budgetData: [] };

    const ranges = [
      { min: 0, max: 500, label: "$0-500" },
      { min: 500, max: 1000, label: "$500-1k" },
      { min: 1000, max: 1500, label: "$1k-1.5k" },
      { min: 1500, max: 2000, label: "$1.5k-2k" },
      { min: 2000, max: 2500, label: "$2k-2.5k" },
      { min: 2500, max: 3000, label: "$2.5k-3k" },
      { min: 3000, label: "$3k+" },
    ];

    const budgets = await prismadb.toursSurveys.findMany({
      where: { hostClerkId: user.id },
      select: { budget: true },
    });

    let budgetRangeCounts = ranges.map((range) => ({
      range: range.label,
      value: 0,
    }));

    budgets.forEach(({ budget }) => {
      const rangeIndex = ranges.findIndex((range) => {
        return range.max
          ? budget >= range.min && budget < range.max
          : budget >= range.min;
      });

      if (rangeIndex !== -1) budgetRangeCounts[rangeIndex].value++;
    });

    return { budgetData: budgetRangeCounts };
  } catch (error) {
    return { budgetData: [] };
  }
};
