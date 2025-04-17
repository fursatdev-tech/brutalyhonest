import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PaymentStatus } from "@prisma/client";

import prismadb from "@/lib/prismadb";

export async function GET(request: NextRequest) {
    const user = await currentUser();

    try {
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const userId = user.id;

        const tourAndReservation = await prismadb.tourReservation.findMany({
            where: {
                userId,
                paymentStatus: { notIn: [PaymentStatus.pending] },
            },
            select: {
                startDate: true,
                id: true,
                endDate: true,
                totalPrice: true,
                createdAt: true,
                status: true,
                paymentStatus: true,
                package: {
                    select: {
                        name: true,
                        accommodationImages: true,
                        duration: true,
                        subtitle: true,
                        id: true,
                        natureOfTravel: true,
                        citiesTraveling: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return NextResponse.json(tourAndReservation);
    } catch (error) {
        return new NextResponse(`ERROR: ${error}`, { status: 500 });
    }
}
