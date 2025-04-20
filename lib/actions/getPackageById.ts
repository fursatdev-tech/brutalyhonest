import prismadb from "@/lib/prismadb";

export default async function getPackage(identifier: string) {
  if (!identifier) throw new Error("Tour package not found");

  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    const foundPackage = await prismadb.tourPackage.findFirst({
      where: isObjectId
        ? { id: identifier }
        : { name: decodeURIComponent(identifier) },
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
