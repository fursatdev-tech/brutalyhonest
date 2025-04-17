"use server";

import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { PriceEnum } from "@prisma/client";

import { stripe } from "@/lib/actions/stripe";
import prismadb from "@/lib/prismadb";
import { MODE_URL } from "@/util/constants";

interface Body {
    amount: number;
    name: string;
    metaData: {
        tourId: string;
        startDate: string;
        endDate: string;
        totalPrice: number;
    };
    description: string;
    cancel_url: string;
    images: string[];
    priceBreakup?: {
        basePrice: number;
        transactionFee: number;
        tax: number;
    };
    currency: PriceEnum;
}

export async function tourCheckoutSessions(body: Body) {
    let CURRENCY = body.currency || PriceEnum.inr;

    const user = await currentUser();

    try {
        if (!user) return { error: "Unauthorized" };

        let {
            amount,
            name,
            metaData,
            cancel_url,
            images,
            priceBreakup,
            description,
        } = body;

        const userId = user.id;

        const prismaData = {
            ...metaData,
            userId,
            priceBreakup: {
                ...priceBreakup,
                total: amount,
            },
            currency: CURRENCY,
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
            update: prismaData,
        });

        const metadata = {
            tourId: metaData.tourId,
            requestUrl: `${MODE_URL}/api/reservations`,
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
                            description,
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${MODE_URL}/my-trips?`,
            cancel_url: `${MODE_URL}${cancel_url}`,
            metadata,
            payment_intent_data: {
                transfer_group: reservation.id,
                metadata,
            },
        };

        const checkoutSession: Stripe.Checkout.Session =
            await stripe.checkout.sessions.create(params);

        return { data: checkoutSession };
    } catch (error) {
        return {
            error: `ERROR: ${error}`,
        };
    }
}
