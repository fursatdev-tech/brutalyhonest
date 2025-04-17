import prismadb from "@/lib/prismadb";

export default async function getListingById(listingId: string) {
  if (!listingId) throw new Error("Listing not found");

  try {
    const listing = await prismadb.listing.findUnique({
      where: {
        id: listingId,
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        images: true,
        location: true,
        description: true,
        bedrooms: true,
        beds: true,
        guests: true,
        baths: true,
        listingLat: true,
        listingLng: true,
        guestSatisfactionOverall: true,
        reviewsCount: true,
        originalPrice: true,
        propertyType: true,
        allowsChildren: true,
        allowsInfants: true,
        allowsPets: true,
        minNights: true,
        maxNights: true,
        amenities: true,
        perGuestPricing: true,
        pgOriginalPrice: true,
        allowFreeStay: true,
        status: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            label: true,
            icon: true,
            description: true,
            id: true,
          },
        },
      },
    });

    if (!listing) throw new Error("Listing not found");

    return listing;
  } catch (error: any) {
    throw new Error(error);
  }
}
