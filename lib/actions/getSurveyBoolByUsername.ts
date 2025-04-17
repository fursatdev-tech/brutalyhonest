import prismadb from "../prismadb";

export const getSurveyBoolByUsername = async (params: {
  username?: string;
}) => {
  const { username } = params;

  if (!username) return false;

  try {
    const foundUser = await prismadb.user.findUnique({
      where: { username },
      select: { clerkId: true },
    });

    if (!foundUser) return false;

    const foundSurvey = await prismadb.tours.findFirst({
      where: { userId: foundUser.clerkId },
      select: { id: true },
    });

    if (!foundSurvey) return false;

    return true;
  } catch (error) {
    return false;
  }
};
