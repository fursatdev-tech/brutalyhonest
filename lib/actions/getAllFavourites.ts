import { currentUser } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export const getAllFavourites = async () => {
  const user = await currentUser();

  if (!user) return [];

  try {
    const foundUser = await prismadb.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        favoriteIds: true,
      },
    });

    if (!foundUser) return [];

    return foundUser.favoriteIds;
  } catch (error: any) {
    throw new Error(`${error}`);
  }
};
