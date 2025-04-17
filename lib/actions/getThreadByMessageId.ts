import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

export const getThreadByMessageId = async (
    messageId: string | undefined,
    role: string
) => {
    const user = await currentUser();

    if (!user) throw new Error("Unauthorized");

    if (!messageId) throw new Error("Message id is required");

    try {
        const message = await prismadb.message.findUnique({
            where: { id: messageId },
            select: {
                id: true,
                reservationId: true,
                reservation: {
                    select: {
                        totalPrice: true,
                        startDate: true,
                        endDate: true,
                        adults: true,
                        children: true,
                        infants: true,
                        pets: true,
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
        });

        if (!message) return {};

        const thread = await prismadb.thread.findMany({
            where: {
                messageId,
            },
            select: {
                id: true,
                text: true,
                role: true,
                actions: true,
                createdAt: true,
                updatedAt: true,
                actionCategory: true,
                isUnread: true,
                guest: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
                host: {
                    select: {
                        name: true,
                        profilePhotoUrl: true,
                    },
                },
            },
        });

        if (!thread) return { message, thread: [] };

        return { thread, message };
    } catch (error: any) {
        throw new Error(error);
    }
};
