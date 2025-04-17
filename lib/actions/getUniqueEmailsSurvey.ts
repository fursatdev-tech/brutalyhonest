import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export const getUniqueEmailsSurvey = async () => {
  try {
    const user = await currentUser();

    if (!user) return { emails: 0 };

    const emails = await prismadb.toursSurveys.findMany({
      where: {
        hostClerkId: user.id,
      },
      distinct: ["email"],
    });

    return { emails: emails.length };
  } catch (error) {
    return { emails: 0 };
  }
};
