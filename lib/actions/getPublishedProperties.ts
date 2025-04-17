import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

export default async function getPublishedProperties() {
    const user = await currentUser();

    if (!user) return [];

    const userId = user.id;

    try {
        const properties = await prismadb.listing.findMany({
            where: {
                OR: [
                    {
                        userId,
                    },
                    {
                        host: {
                            userId,
                        },
                    },
                    {
                        coHost: {
                            some: {
                                host: {
                                    userId,
                                },
                            },
                        },
                    },
                ],
            },
            select: {
                id: true,
                imageUrl: true,
                title: true,
                propertyType: true,
                createdAt: true,
                location: true,
                country: true,
                guestSatisfactionOverall: true,
                host: {
                    select: {
                        name: true,
                        profilePhotoUrl: true,
                    },
                },
                status: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!properties) return [];

        return properties;
    } catch (error: any) {
        throw new Error(error);
    }
}
