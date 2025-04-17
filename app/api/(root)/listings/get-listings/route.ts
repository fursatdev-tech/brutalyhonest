import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { User } from "@clerk/nextjs/server";
import { List } from "lucide-react";
import { ListingStatus } from "@prisma/client";

interface ListingsParams {
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
    username?: string;
}

export async function GET(request: NextRequest) {
    const user = await currentUser();

    try {
        const username = request.nextUrl.searchParams.get("username");
        const category = request.nextUrl.searchParams.get("category");
        const listingId = request.nextUrl.searchParams.get("listingId");
        const favourites = request.nextUrl.searchParams.get("favourites");

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

            if (error) return NextResponse.json(`${error}`, { status: 400 });

            query = updatedQuery;
        }

        // if (roomCount) {
        //   query.roomCount = {
        //     gte: +roomCount,
        //   };
        // }

        // if (guestCount) {
        //   query.guestCount = {
        //     gte: +guestCount,
        //   };
        // }

        // if (bathroomCount) {
        //   query.bathroomCount = {
        //     gte: +bathroomCount,
        //   };
        // }

        // if (locationValue) {
        //   query.locationArea = {
        //     contains: locationValue,
        //   };
        // }

        // if (startDate && endDate) {
        //   query.NOT = {
        //     reservations: {
        //       some: {
        //         OR: [
        //           {
        //             endDate: { gte: startDate },
        //             startDate: { lte: startDate },
        //           },
        //           {
        //             startDate: { lte: endDate },
        //             endDate: { gte: endDate },
        //           },
        //         ],
        //       },
        //     },
        //   };
        // }

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

        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return NextResponse.json({ data: safeListings }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(`ERROR: ${error}`, { status: 500 });
    }
}

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
