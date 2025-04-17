"use server";
import { currentUser } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export const checkInfluencerSocials = async () => {
  const user = await currentUser();

  try {
    if (!user) return false;

    const foundTour = await prismadb.tours.findUnique({
      where: {
        userId: user.id,
        OR: [
          { instagram: { not: null } },
          { youtube: { not: null } },
          { facebook: { not: null } },
        ],
      },
    });

    if (!foundTour) return false;

    return true;
  } catch (error) {
    return false;
  }
};
