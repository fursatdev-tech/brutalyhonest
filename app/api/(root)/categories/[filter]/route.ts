import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

interface IParams {
    filter?: string;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<IParams> }
) {
    const { filter } = await params;

    try {
        let query = {};

        // if (filter !== "all")
        //   query = {
        //     listings: {
        //       some: {},
        //     },
        //   };

        const categories = await prismadb.category.findMany({
            where: {},
            select: { id: true, label: true, icon: true },
        });

        return NextResponse.json({ categories });
    } catch (error) {
        return new NextResponse(`${error}`, { status: 500 });
    }
}
