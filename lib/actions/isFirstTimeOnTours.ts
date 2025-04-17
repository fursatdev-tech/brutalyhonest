import { currentUser } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export const isFirstTimeOnTours = async () => {
  const user = await currentUser();

  if (!user) return false;

  const foundTour = await prismadb.tours.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!foundTour) return false;

  return !!foundTour.id;
};
