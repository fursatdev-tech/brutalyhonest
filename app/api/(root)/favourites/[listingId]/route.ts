import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

interface IParams {
    listingId?: string;
}

export async function POST(
    request: Request,
    { params }: { params: Promise<IParams> }
) {
    const user = await currentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { listingId } = await params;

    if (!listingId || typeof listingId !== "string")
        return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prismadb.user.findUnique({
        where: { clerkId: user.id },
        select: { favoriteIds: true },
    });

    if (!dbUser) return new NextResponse("Unauthorized", { status: 401 });

    let favoriteIds = [...(dbUser.favoriteIds || [])];

    if (favoriteIds.includes(listingId))
        return NextResponse.json({ favoriteIds });

    favoriteIds.push(listingId);

    await prismadb.user.update({
        where: {
            clerkId: user.id,
        },
        data: {
            favoriteIds,
        },
    });

    return NextResponse.json({ favoriteIds });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<IParams> }
) {
    const user = await currentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { listingId } = await params;

    if (!listingId || typeof listingId !== "string")
        return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prismadb.user.findUnique({
        where: { clerkId: user.id },
        select: { favoriteIds: true },
    });

    if (!dbUser) return new NextResponse("Unauthorized", { status: 401 });

    let favoriteIds = [...(dbUser.favoriteIds || [])];

    favoriteIds = favoriteIds.filter((id) => id !== listingId);

    await prismadb.user.update({
        where: {
            clerkId: user.id,
        },
        data: {
            favoriteIds,
        },
    });

    return NextResponse.json({ favoriteIds });
}
