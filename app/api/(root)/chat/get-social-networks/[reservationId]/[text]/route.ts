import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

type Props = {
    params: Promise<{
        reservationId: string;
        text: string;
    }>;
};

export async function GET(request: Request, { params }: Props) {
    const { text, reservationId } = await params;

    try {
        if (!reservationId || !text || !text.includes("Free Stay"))
            return NextResponse.json({ data: {} });

        const foundSocials = await prismadb.reservation.findUnique({
            where: { id: reservationId },
            select: {
                user: {
                    select: {
                        tours: {
                            select: {
                                instagram: true,
                                facebook: true,
                                youtube: true,
                            },
                        },
                    },
                },
            },
        });

        if (!foundSocials) return NextResponse.json({ data: {} });

        const { tours } = foundSocials.user;

        return NextResponse.json({ data: tours });

        return NextResponse.json({});
    } catch (error: any) {
        return new NextResponse(`${error}`, { status: 500 });
    }
}
