import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { User } from "@clerk/nextjs/server";
import { ListingStatus } from "@prisma/client";
import { SafeListing } from "@/util/types";
import { unstable_cache } from "../cache";

interface Props {
  username?: string;
  category?: string;
  listingId?: string;
  tourId?: string;
  favourites?: boolean;
  location?: string;
  showAll?: boolean;
}

export const getListings = async ({
  username,
  category,
  listingId,
  favourites,
  location,
}: Props) => {
  const user = await currentUser();

  try {
    let query = {};

    if (category)
      query = {
        ...query,
        category: {
          label: {
            equals: category,
            mode: "insensitive",
          },
        },
      };

    if (username)
      query = {
        ...query,
        OR: [
          {
            user: {
              username,
            },
          },
          {
            host: {
              user: {
                username,
              },
            },
          },
          {
            coHost: {
              some: {
                host: {
                  user: {
                    username,
                  },
                },
              },
            },
          },
        ],
      };

    if (listingId)
      query = {
        ...query,
        id: listingId,
      };

    if (favourites) {
      const { query: updatedQuery, error } = await constructQuery4Fav(
        user,
        query
      );

      if (error) throw new Error(error);

      query = updatedQuery;
    }

    if (location)
      query = {
        ...query,
        location: {
          contains: location,
          mode: "insensitive",
        },
      };

    const listings = await prismadb.listing.findMany({
      where: {
        status: ListingStatus.published,
        ...query,
      },
      include: {
        host: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            label: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListings: SafeListing[] = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
};

const constructQuery4Fav = async (user: User | null, query: any) => {
  if (!user) return { error: "Please login to continue" };

  const foundUser = await prismadb.user.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      favoriteIds: true,
    },
  });

  if (!foundUser) return { error: "User not found" };

  return {
    query: {
      ...query,
      id: { in: foundUser.favoriteIds },
    },
  };
};

export const getTours = unstable_cache(
  async ({ username, tourId, location, showAll = false }: Props) => {
    try {
      let query = {};

      if (location) {
        query = {
          OR: [
            {
              name: {
                contains: location,
                mode: "insensitive",
              },
            },
            {
              summary: {
                contains: location,
                mode: "insensitive",
              },
            },
            {
              itinerary: {
                contains: location,
                mode: "insensitive",
              },
            },
            {
              guidesTips: {
                contains: location,
                mode: "insensitive",
              },
            },
          ],
        };
      }

      const tours = await prismadb.tourPackage.findMany({
        where: {
          ...query,
        },
        select: {
          name: true,
          accommodationImages: true,
          duration: true,
          subtitle: true,
          id: true,
          natureOfTravel: true,
          costPrice: true,
          sellingPrice: true,
          isLive: true,
          citiesTraveling: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return tours;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  ["homepage-tours"],
  {
    revalidate: 60 * 60 * 2, // two hours
  }
);
