import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export const getAgeData = async () => {
  try {
    const user = await currentUser();

    if (!user) return { ageData: [] };

    const ranges = [
      { min: 0, max: 17, label: "0-17" },
      { min: 18, max: 25, label: "18-25" },
      { min: 26, max: 30, label: "26-30" },
      { min: 31, max: 35, label: "31-35" },
      { min: 36, max: 40, label: "36-40" },
      { min: 41, max: 45, label: "41-45" },
      { min: 46, max: 50, label: "46-50" },
      { min: 52, label: "51+" },
    ];

    const ages = await prismadb.toursSurveys.findMany({
      where: { hostClerkId: user.id },
      select: { age: true },
    });

    let ageRangeCounts = ranges.map((range) => ({
      range: range.label,
      value: 0,
    }));

    ages.forEach(({ age }) => {
      const rangeIndex = ranges.findIndex((range) => {
        return range.max
          ? age >= range.min && age < range.max
          : age >= range.min;
      });

      if (rangeIndex !== -1) ageRangeCounts[rangeIndex].value++;
    });

    return { ageData: ageRangeCounts };
  } catch (error) {
    return { ageData: [] };
  }
};
