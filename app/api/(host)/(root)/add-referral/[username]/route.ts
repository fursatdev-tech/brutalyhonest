import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

interface IParams {
    username?: string;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<IParams> }
) {
    const user = await currentUser();
    const currentParams = await params;

    try {
        if (!user)
            return NextResponse.json(
                "Referral not applicable. User not signed in!"
            );

        if (!currentParams.username)
            return NextResponse.json(
                "Referral not applicable. No username provided!"
            );

        const invitedBy = await prismadb.user.findUnique({
            where: { username: currentParams.username },
            select: { clerkId: true },
        });

        if (!invitedBy)
            return NextResponse.json(
                "Referral not applicable. Invalid username!"
            );

        const userToUpdate = await prismadb.user.findUnique({
            where: { clerkId: user.id },
            select: { createdAt: true },
        });

        if (!userToUpdate)
            throw new Error(
                "Referral not applicable. User to update not found!"
            );

        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

        if (oneMinuteAgo > userToUpdate.createdAt)
            return NextResponse.json("Referral not added. Time missmatch!");

        await prismadb.user.update({
            where: {
                clerkId: user.id,
                invitedBy: { equals: undefined },
            },
            data: {
                invitedBy: invitedBy.clerkId,
            },
        });

        return NextResponse.json("Referral added successfully!");
    } catch (error) {
        return NextResponse.json("ERROR: " + error, { status: 500 });
    }
}
