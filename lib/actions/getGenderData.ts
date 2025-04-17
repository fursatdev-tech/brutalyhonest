import { currentUser } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";
import { Gender } from "@prisma/client";

export const getGenderData = async () => {
  try {
    const user = await currentUser();

    if (!user) return { genderData: [] };

    const surveys = await prismadb.toursSurveys.findMany({
      where: { hostClerkId: user.id },
      select: { gender: true },
    });

    const genderCounts = surveys.reduce<Record<string, number>>(
      (acc, { gender }) => {
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      },
      {}
    );

    const genderData = Object.keys(genderCounts).map((matrix) => ({
      matrix:
        matrix === Gender.male
          ? "Male"
          : Gender.female
          ? "Female"
          : "Non-binary",
      count: genderCounts[matrix],
    }));

    return { genderData };
  } catch (error) {
    return { genderData: [] };
  }
};
