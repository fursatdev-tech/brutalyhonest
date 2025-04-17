import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/actions/stripe";
import prismadb from "@/lib/prismadb";
import { cookies } from "next/headers";
import { getConvertedPricePG } from "@/lib/actions/getConvertedPrice";

interface Body {
    amount: number;
    name: string;
    metaData: {
        tourId: string;
        startDate: string;
        endDate: string;
        totalPrice: number;
        description: string;
    };
    cancel_url: string;
    images: string[];
    priceBreakup?: {
        basePrice: number;
        transactionFee: number;
    };
}

const cookieName = process.env.CURRENCY_COOKIE_NAME || "currency";

export async function POST(request: NextRequest) {
    let CURRENCY = "USD";

    const user = await currentUser();

    const body: Body = await request.json();

    try {
        if (!user) return NextResponse.json("Unauthorized", { status: 401 });

        const cookieList = await cookies();

        const foundCookie = cookieList.get(cookieName);

        let { amount, name, metaData, cancel_url, images, priceBreakup } = body;

        let usd_amount = amount;

        if (foundCookie && foundCookie.value !== CURRENCY) {
            CURRENCY = foundCookie.value;

            usd_amount = await getConvertedPricePG(amount);
            metaData.totalPrice = await getConvertedPricePG(
                metaData.totalPrice
            );

            if (priceBreakup) {
                priceBreakup.basePrice = await getConvertedPricePG(
                    priceBreakup.basePrice
                );
                priceBreakup.transactionFee = await getConvertedPricePG(
                    priceBreakup.transactionFee
                );
            }
        }

        const userId = user.id;

        const prismaData = {
            ...metaData,
            userId,
            priceBreakup: {
                ...priceBreakup,
                total: usd_amount / 100,
            },
        };

        const reservation = await prismadb.tourReservation.upsert({
            where: {
                userId_tourId_startDate_endDate: {
                    tourId: metaData.tourId,
                    userId,
                    startDate: new Date(metaData.startDate),
                    endDate: new Date(metaData.endDate),
                },
            },
            create: prismaData,
            update: metaData,
        });

        const metadata = {
            tourId: metaData.tourId,
            requestUrl: `${request.headers.get("origin")}/api/reservations`,
            clerkId: userId,
            reservationId: reservation.id,
        };

        const params: Stripe.Checkout.SessionCreateParams = {
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: CURRENCY,
                        product_data: {
                            name,
                            images,
                            description: metaData.description,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${request.headers.get("origin")}/my-trips`,
            cancel_url: `${cancel_url}`,
            metadata,
            payment_intent_data: {
                transfer_group: reservation.id,
                metadata,
            },
        };

        const checkoutSession: Stripe.Checkout.Session =
            await stripe.checkout.sessions.create(params);

        return NextResponse.json(checkoutSession);
    } catch (error) {
        return new NextResponse(`ERROR: ${error}`, { status: 500 });
    }
}
