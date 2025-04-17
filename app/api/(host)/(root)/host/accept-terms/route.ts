import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(request: Request) {
    const user = await currentUser();

    try {
        if (!user) return NextResponse.json("Unauthorized", { status: 401 });

        const createUserData = {
            name: `${user.firstName} ${user.lastName}`,
            hostEmail: user.emailAddresses[0].emailAddress.toLowerCase().trim(),
            hostPhone: user.phoneNumbers[0].phoneNumber,
            profilePhotoUrl: user.imageUrl,
            userId: user.id,
        };

        await prismadb.host.upsert({
            where: {
                userId: user.id,
            },
            create: {
                acceptedTerms: true,
                ...createUserData,
            },
            update: { acceptedTerms: true },
        });

        return NextResponse.json("Reservation updated successfully");
    } catch (error) {
        return new NextResponse(`${error}`, { status: 500 });
    }
}
