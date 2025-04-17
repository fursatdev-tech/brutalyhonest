import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";

import { AIRBNB_URLS, BOOKING_URLS } from "@/util/constants";

export async function POST(request: Request) {
    const user = await currentUser();

    const { url } = await request.json();

    try {
        const isBookingUrl = BOOKING_URLS.some((_url) => url.includes(_url));

        if (isBookingUrl)
            return NextResponse.json({
                propertyId: url.split("?")[0],
                isBookingUrl,
            });

        if (!url) return NextResponse.json("Invalid url", { status: 400 });

        const response = await axios.get(url);

        let modifiedUrl = response.request.res.responseUrl;

        AIRBNB_URLS.forEach((airbnbUrl) => {
            modifiedUrl = modifiedUrl.replace(airbnbUrl, "");
        });

        modifiedUrl = modifiedUrl.split("?")[0];

        if (containsSpecialCharacters(modifiedUrl))
            return NextResponse.json("Invalid url", { status: 400 });

        return NextResponse.json({ propertyId: modifiedUrl, isBookingUrl });
    } catch (error: any) {
        return new NextResponse(`${error}`, { status: 500 });
    }
}

function containsSpecialCharacters(str: string) {
    return /[^a-zA-Z0-9]/.test(str);
}
