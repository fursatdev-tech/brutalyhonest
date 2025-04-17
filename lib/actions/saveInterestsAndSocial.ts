"use server";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import prismadb from "@/lib/prismadb";

interface TourData {
  interests?: string[];
  instagram?: string;
  facebook?: string;
  channel?: string;
  hostedBefore?: boolean;
  prevHostedTrips?: string;
  prevAvgCost?: string;
}

export const saveInterestsAndSocial = async (tourData: TourData) => {
  const user = await currentUser();

  if (!user) return { error: "User not found." };

  try {
    await prismadb.tours.upsert({
      where: {
        userId: user.id,
      },
      create: { ...tourData, userId: user.id },
      update: tourData,
    });

    revalidatePath("/hosting/tours");

    return { success: true };
  } catch (error) {
    return { error: "Unable to save data. Please try again later." };
  }
};
