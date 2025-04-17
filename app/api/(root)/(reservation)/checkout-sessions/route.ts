import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
    ActionCategories,
    ActionTypes,
    PaymentStatus,
    PriceEnum,
} from "@prisma/client";
import axios from "axios";

import { stripe } from "@/lib/actions/stripe";
import prismadb from "@/lib/prismadb";
import { MODE_URL } from "@/util/constants";
interface Body {
    amount: number;
    name: string;
    adults: number;
    children: number;
    infants: number;
    pets: number;
    currency: PriceEnum;
    metaData: {
        listingId: string;
        startDate: string;
        endDate: string;
        totalPrice: number;
    };
    cancel_url: string;
    images: string[];
    minNights: number;
    maxNights: number;
    nights?: number;
    priceBreakup?: {
        basePrice: number;
        extraGuestCharges: number;
        transactionFee: number;
        tax: number;
    };
    allowFreeStay: boolean;
}

export async function POST(request: NextRequest) {
    let CURRENCY = "INR";

    const user = await currentUser();

    const body: Body = await request.json();

    try {
        if (!user) return NextResponse.json("Unauthorized", { status: 401 });

        let {
            amount,
            name,
            metaData,
            cancel_url,
            images,
            adults,
            children,
            infants,
            pets,
            minNights,
            maxNights,
            nights,
            priceBreakup,
            currency,
            allowFreeStay = false,
        } = body;

        const userId = user.id;

        const prismaData = {
            adults,
            children,
            infants,
            pets,
            ...metaData,
            userId,
            nights,
            ...(allowFreeStay && {
                paymentStatus: PaymentStatus.succeeded,
                totalPrice: 0,
            }),
        };

        const reservation = await prismadb.reservation.upsert({
            where: {
                userId_listingId_startDate_endDate: {
                    listingId: metaData.listingId,
                    userId,
                    startDate: new Date(metaData.startDate),
                    endDate: new Date(metaData.endDate),
                },
            },
            create: prismaData,
            update: {
                ...metaData,
                ...(allowFreeStay && {
                    paymentStatus: PaymentStatus.succeeded,
                    totalPrice: 0,
                }),
            },
        });

        const priceBreakupData = allowFreeStay
            ? {
                  basePrice: 0,
                  extraGuestCharges: 0,
                  transactionFee: 0,
                  total: 0,
                  tax: 0,
                  currency,
              }
            : {
                  ...priceBreakup,
                  total: amount / 100,
                  currency,
              };

        await prismadb.priceBreakup.upsert({
            where: {
                reservationId: reservation.id,
            },
            create: {
                ...priceBreakupData,
                reservationId: reservation.id,
            },
            update: priceBreakupData,
        });

        if (allowFreeStay) {
            await reserveRequestFreeStay({
                reservationId: reservation.id,
                guestId: userId,
                listingId: metaData.listingId,
                guestName: user.firstName + " " + user.lastName,
            });

            return NextResponse.json({ booked: true });
        }

        const metadata = {
            listingId: metaData.listingId,
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
                            ...(!!minNights &&
                                !!maxNights && {
                                    description: `This property requires a minimum booking of ${minNights} nights.`,
                                }),
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

const reserveRequestFreeStay = async ({
    reservationId,
    guestId,
    listingId,
    guestName,
}: IFreeStayRequest) => {
    const listing = await prismadb.listing.findUnique({
        where: {
            id: listingId,
        },
        select: {
            title: true,
            hostId: true,
            host: {
                select: {
                    hostEmail: true,
                    name: true,
                },
            },
        },
    });

    if (!listing) return;

    await prismadb.message.create({
        data: {
            reservationId,
            listingId,
            thread: {
                create: {
                    text: "New reservation request (Free Stay)!",
                    actions: [
                        { type: ActionTypes.btnAccept, label: "Accept" },
                        { type: ActionTypes.btnReject, label: "Decline" },
                    ],
                    actionCategory: ActionCategories.approval,
                    guestId,
                    hostId: listing.hostId,
                },
            },
        },
    });

    await axios.post(`${MODE_URL}/api/email/review-request`, {
        email: listing.host.hostEmail,
        guestName,
        name: listing.host.name,
        listingName: listing.title,
        transactionId: "Free Stay",
        amountPaid: 0,
    });
};

interface IFreeStayRequest {
    reservationId: string;
    guestId: string;
    listingId: string;
    guestName: string;
}
