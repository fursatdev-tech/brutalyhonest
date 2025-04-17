"use server";

import prismadb from "@/lib/prismadb";
import { ListingStatus } from "@prisma/client";

export const unpublishListingAction = async (propertyId: string) => {
  if (!propertyId) return { message: "Property not found", error: true };

  const foundListing = await prismadb.listing.findUnique({
    where: { id: propertyId },
    select: { status: true },
  });

  if (!foundListing) return { message: "Property not found", error: true };

  const isPublished = foundListing?.status === ListingStatus.published;

  if (!isPublished)
    return { message: "Property is not published", error: true };

  await prismadb.listing.update({
    where: { id: propertyId },
    data: { status: ListingStatus.unpublished },
  });

  return { message: "Property unpublished" };
};
