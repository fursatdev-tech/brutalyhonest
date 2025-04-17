"use server";

import { currentUser } from "@clerk/nextjs/server";
import { ListingStatus } from "@prisma/client";

import prismadb from "@/lib/prismadb";

export const canUserPublish = async (propertyId: string) => {
  const user = await currentUser();

  if (!user || !propertyId) return false;

  const foundProperty = await prismadb.listing.findUnique({
    where: {
      id: propertyId,
      OR: [
        { status: ListingStatus.draft },
        { status: ListingStatus.unpublished },
      ],
    },
    select: {
      host: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!foundProperty || foundProperty.host.userId !== user.id) return false;

  return true;
};
