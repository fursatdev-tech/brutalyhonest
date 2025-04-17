import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export const getQualifiedAndTotalResponses = async () => {
  try {
    const user = await currentUser();

    if (!user) return { qualified: 0, total: 0 };

    const qualified = await prismadb.toursSurveys.count({
      where: {
        hostClerkId: user.id,
        AND: [{ age: { gte: 18 } }, { budget: { gte: 1000 } }],
      },
    });

    const total = await prismadb.toursSurveys.count({
      where: {
        hostClerkId: user.id,
      },
    });

    return { qualified, total };
  } catch (error) {
    return { qualified: 0, total: 0 };
  }
};
