import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { ListingStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const user = await currentUser();

    try {
        if (!user) return NextResponse.json("Unauthorized", { status: 401 });

        const { propertyId } = await request.json();

        if (!propertyId)
            return NextResponse.json("Property Id is required", {
                status: 400,
            });

        const foundProperty = await prismadb.listing.findUnique({
            where: {
                id: propertyId,
                OR: [
                    { status: ListingStatus.draft },
                    { status: ListingStatus.unpublished },
                ],
            },
            select: {
                host: {
                    select: {
                        userId: true,
                    },
                },
            },
        });

        if (!foundProperty)
            return NextResponse.json(
                "No property found in draft with given id.",
                {
                    status: 404,
                }
            );

        if (foundProperty.host.userId !== user.id)
            return NextResponse.json(
                "Only host of the listing can make property live. We have sent the host an e-mail to do so.",
                { status: 401 }
            );

        await prismadb.listing.update({
            where: {
                id: propertyId,
            },
            data: {
                status: ListingStatus.published,
            },
        });

        return NextResponse.json({
            message: "Property published successfully",
        });
    } catch (error: any) {
        return new NextResponse(`${JSON.stringify(error)}`, { status: 500 });
    }
}
