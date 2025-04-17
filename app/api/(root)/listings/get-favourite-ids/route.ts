import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const user = await currentUser();

    if (!user) return NextResponse.json({ data: [] }, { status: 200 });

    try {
        const foundUser = await prismadb.user.findUnique({
            where: {
                clerkId: user.id,
            },
            select: {
                favoriteIds: true,
            },
        });

        if (!foundUser) return NextResponse.json({ data: [] }, { status: 200 });

        return NextResponse.json(
            { data: foundUser.favoriteIds },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: `${error}` }, { status: 500 });
    }
}
