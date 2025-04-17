import prismadb from "@/lib/prismadb";

export default async function getPackageById(packageId: string) {
  if (!packageId) throw new Error("Tour package not found");

  try {
    const foundPackage = await prismadb.tourPackage.findUnique({
      where: {
        id: packageId,
      },
      select: {
        id: true,
        name: true,
        accommodationImages: true,
        subtitle: true,
        dayActivities: true,
        inclusions: true,
        exclusions: true,
        duration: true,
        itinerary: true,
        sellingPrice: true,
        startDate: true,
        endDate: true,
        hotelDetails: true,
        bookingScore: true,
        accommodationStar: true,
        videoUrl: true,
        citiesTraveling: true,
        isLive: true,
      },
    });

    if (!foundPackage) throw new Error("Tour package not found");

    return foundPackage;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
