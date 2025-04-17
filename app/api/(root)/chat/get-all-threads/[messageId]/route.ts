import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

type Props = {
    params: Promise<{
        messageId: string;
    }>;
};

export async function GET(request: Request, { params }: Props) {
    const user = await currentUser();
    const { messageId } = await params;

    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    if (!messageId)
        return new NextResponse("Message id is required", { status: 400 });

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

        if (!message) return NextResponse.json({ thread: [], message });

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

        if (!thread) return NextResponse.json({ thread: [], message });

        return NextResponse.json({ thread, message });
    } catch (error: any) {
        return new NextResponse(`${error}`, { status: 500 });
    }
}
