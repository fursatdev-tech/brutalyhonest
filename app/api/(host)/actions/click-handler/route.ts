import { currentUser } from "@clerk/nextjs/server";
import {
    ActionCategories,
    ActionTypes,
    ReservationStatus,
} from "@prisma/client";
import { NextResponse } from "next/server";
import axios from "axios";

import prismadb from "@/lib/prismadb";
import { MODE_URL } from "@/util/constants";
import { guestAutoCompleteAI } from "@/util/routes";

export const maxDuration = 50; // 50 seconds
export const dynamic = "force-dynamic";

type Body = {
    action: ActionTypes;
    actionCategory: ActionCategories;
    reservationId: string;
    messageId: string;
    threadId: string;
    text: string;
};

export async function POST(request: Request) {
    const user = await currentUser();

    const body: Body = await request.json();

    try {
        if (!user) return NextResponse.json("Unauthorized", { status: 401 });

        const {
            action,
            actionCategory,
            reservationId,
            messageId,
            threadId,
            text,
        } = body;

        if (!reservationId || !messageId || !threadId)
            return NextResponse.json("Missing required id parameter(s)", {
                status: 401,
            });

        if (actionCategory !== ActionCategories.approval)
            return NextResponse.json("Invalid Action", { status: 400 });

        const status =
            action === ActionTypes.btnAccept
                ? ReservationStatus.confirmed
                : ActionTypes.btnReject
                ? ReservationStatus.rejected
                : ReservationStatus.pending;

        const reservation = await prismadb.reservation.update({
            where: { id: reservationId },
            data: { status },
            select: {
                listingId: true,
                listing: {
                    select: {
                        title: true,
                        hostId: true,
                        host: {
                            select: {
                                id: true,
                                userId: true,
                            },
                        },
                        coHost: {
                            select: {
                                host: {
                                    select: {
                                        id: true,
                                        userId: true,
                                    },
                                },
                            },
                        },
                    },
                },
                startDate: true,
                endDate: true,
                userId: true,
                nights: true,
                adults: true,
                children: true,
                infants: true,
                pets: true,
            },
        });

        await prismadb.message.update({
            where: { id: messageId },
            data: {
                listingId: reservation.listingId,
                thread: {
                    update: {
                        where: {
                            id: threadId,
                        },
                        data: {
                            isUnread: false,
                        },
                    },
                    create: {
                        text: `Reservation ${status} by the host.`,
                        guestId: reservation.userId,
                        hostId: reservation.listing.hostId,
                    },
                },
            },
        });

        if (action !== ActionTypes.btnAccept)
            return NextResponse.json("Reservation updated successfully");

        await axios.post(`${MODE_URL}${guestAutoCompleteAI(messageId)}`, {
            prompt: "Reservation Confirmation with Guidebook",
            userId: user.id,
        });

        const title = `${reservation.listing.title} | ${
            reservation.nights
        } nights | ${reservation.adults + reservation.children} guests`;

        const events = {
            create: {
                title,
                start: reservation.startDate,
                end: reservation.endDate,
                description: `Adults: ${reservation.adults}, Children: ${
                    reservation.children || 0
                }, Infants: ${reservation.infants || 0}, Pets: ${
                    reservation.pets || 0
                }`,
            },
        };

        await prismadb.calendar.upsert({
            where: { hostId: reservation.listing.hostId },
            create: {
                userId: reservation.listing.host.userId!,
                hostId: reservation.listing.hostId,
                events,
            },
            update: {
                events,
            },
        });

        for (const coHost of reservation.listing.coHost) {
            await prismadb.calendar.upsert({
                where: {
                    hostId: reservation.listing.host.id,
                },
                create: {
                    userId: coHost.host.userId!,
                    hostId: coHost.host.id,
                    events,
                },
                update: {
                    events,
                },
            });
        }

        return NextResponse.json("Reservation updated successfully");
    } catch (error) {
        return new NextResponse(`${error}`, { status: 500 });
    }
}
