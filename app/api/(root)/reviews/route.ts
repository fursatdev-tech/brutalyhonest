import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const user = await currentUser();

    const body = await request.json();

    try {
        if (!user) return NextResponse.json("Unauthorized", { status: 401 });

        let {
            valueRating,
            locationRating,
            communicationRating,
            checkinRating,
            accuracyRating,
            cleanlinessRating,
            overallRating: guestSatisfactionOverall,
            checkinFeedback,
            cleanlinessFeedback,
            accuracyFeedback,
            communicationFeedback,
            locationFeedback,
            publicFeedback,
            privateNote,
            reservationId,
            status,
        } = body;

        const reservation = await prismadb.reservation.findUnique({
            where: { id: reservationId },
            select: { listingId: true },
        });

        if (!reservation)
            return NextResponse.json("Reservation not found", { status: 404 });

        const reviewData = {
            valueRating,
            locationRating,
            communicationRating,
            checkinRating,
            accuracyRating,
            cleanlinessRating,
            guestSatisfactionOverall,
            checkinFeedback: checkinFeedback?.join(","),
            cleanlinessFeedback: cleanlinessFeedback?.join(","),
            accuracyFeedback: accuracyFeedback?.join(","),
            communicationFeedback: communicationFeedback?.join(","),
            locationFeedback: locationFeedback?.join(","),
            publicFeedback,
            privateNote,
            status,
        };

        await prismadb.review.upsert({
            where: { reservationId },
            create: {
                ...reviewData,
                reservationId,
                listingId: reservation.listingId,
                userId: user.id,
            },
            update: reviewData,
        });

        return NextResponse.json("Saved");
    } catch (error) {
        return new NextResponse(`${error}`, { status: 500 });
    }
}
