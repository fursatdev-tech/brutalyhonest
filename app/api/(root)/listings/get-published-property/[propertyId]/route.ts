import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ propertyId: string }> }
) {
    const user = await currentUser();

    if (!user) return NextResponse.json("Unauthorized", { status: 401 });

    const userId = user.id;

    try {
        const foundProperty = await prismadb.listing.findUnique({
            where: {
                id: (await params).propertyId,
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
                description: true,
                location: true,
                images: true,
                bedrooms: true,
                baths: true,
                guests: true,
                beds: true,
                listingLat: true,
                listingLng: true,
                originalPrice: true,
                b2bPrice: true,
                pgOriginalPrice: true,
                pgB2bPrice: true,
                perGuestPricing: true,
                cancellationPolicyId: true,
                host: {
                    select: {
                        name: true,
                        hostEmail: true,
                        hostPhone: true,
                    },
                },
                categoryId: true,
            },
        });

        if (!foundProperty)
            return NextResponse.json("Property not found", { status: 400 });

        const modifiedProperty = {
            ...foundProperty,
            hostName: foundProperty.host.name,
            hostEmail: foundProperty.host.hostEmail,
            hostPhone: foundProperty.host.hostPhone,
        };

        return NextResponse.json({ data: modifiedProperty }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: `${error}` }, { status: 500 });
    }
}
