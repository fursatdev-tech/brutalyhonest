import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";

export default async function getMessages(role: UserRole) {
    const user = await currentUser();

    if (!user) return [];

    const userId = user.id;

    try {
        let query = {};

        if (role === UserRole.host)
            query = {
                OR: [
                    {
                        host: { userId },
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
            };

        if (role === UserRole.guest)
            query = {
                reservations: {
                    some: {
                        userId,
                    },
                },
            };

        const messages = await prismadb.message.findMany({
            where: {
                listing: query,
            },
            select: {
                id: true,
                reservationId: true,
                reservation: {
                    select: {
                        totalPrice: true,
                        startDate: true,
                        endDate: true,
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
                listing: {
                    select: {
                        title: true,
                        host: {
                            select: {
                                name: true,
                                profilePhotoUrl: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        if (!messages) return [];

        return messages;
    } catch (error: any) {
        throw new Error(error);
    }
}
