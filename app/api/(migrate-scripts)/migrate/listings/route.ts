import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
    try {
        const listings = await prismadb.listing.findMany({
            where: {},
        });

        for (const listing of listings) {
            if (listing.originalPrice.usd) continue;

            listing.originalPrice.usd = (
                parseInt(listing.originalPrice.inr) / 83.52
            )
                .toFixed(2)
                .toString();

            if (listing.b2bPrice)
                listing.b2bPrice.usd = (parseInt(listing.b2bPrice.inr) / 83.52)
                    .toFixed(2)
                    .toString();

            if (listing.pgOriginalPrice)
                listing.pgOriginalPrice.usd = (
                    parseInt(listing.pgOriginalPrice.inr) / 83.52
                )
                    .toFixed(2)
                    .toString();

            if (listing.pgB2bPrice)
                listing.pgB2bPrice.usd = (
                    parseInt(listing.pgB2bPrice.inr) / 83.52
                )
                    .toFixed(2)
                    .toString();

            await prismadb.listing.update({
                where: {
                    id: listing.id,
                },
                data: {
                    originalPrice: listing.originalPrice,
                    b2bPrice: listing.b2bPrice,
                    pgOriginalPrice: listing.pgOriginalPrice,
                    pgB2bPrice: listing.pgB2bPrice,
                },
            });
        }

        return NextResponse.json("Received. Done");
    } catch (error: any) {
        return new NextResponse(`Error: ${error.message}`, {
            status: 500,
        });
    }
}
