import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export const getTimeOfYearData = async () => {
  try {
    const user = await currentUser();

    if (!user) return { toeData: [] };

    const monthlySurveyCounts = await prismadb.surveyMonth.groupBy({
      by: ["monthId"],
      _count: {
        monthId: true,
      },
      where: {
        survey: {
          hostClerkId: user.id,
        },
      },
      orderBy: {
        monthId: "asc",
      },
    });

    const toeData = await Promise.all(
      monthlySurveyCounts.map(async (item) => {
        const month = await prismadb.month.findUnique({
          where: { id: item.monthId },
          select: { value: true },
        });

        return {
          matrix: month?.value || "Unknown",
          count: item._count.monthId,
        };
      })
    );

    return { toeData };
  } catch (error) {
    return { toeData: [] };
  }
};
