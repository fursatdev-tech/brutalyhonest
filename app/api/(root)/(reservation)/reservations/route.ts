import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(request: NextRequest) {
    const user = await currentUser();

    try {
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const userId = user.id;

        const listingAndReservation = await prismadb.reservation.findMany({
            where: {
                userId,
            },
            select: {
                startDate: true,
                id: true,
                endDate: true,
                totalPrice: true,
                createdAt: true,
                status: true,
                paymentStatus: true,
                listing: {
                    select: {
                        id: true,
                        title: true,
                        imageUrl: true,
                        location: true,
                        locationRating: true,
                        propertyType: true,
                        country: true,
                        amenities: true,
                        minNights: true,
                        maxNights: true,
                        host: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                review: {
                    select: {
                        status: true,
                        guestSatisfactionOverall: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return NextResponse.json(listingAndReservation);
    } catch (error) {
        return new NextResponse(`ERROR: ${error}`, { status: 500 });
    }
}
