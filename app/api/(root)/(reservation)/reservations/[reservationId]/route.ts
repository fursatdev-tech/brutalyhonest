import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { differenceInDays, differenceInCalendarDays, addDays } from "date-fns";
import {
    CancellationRule,
    PaymentCalcType,
    PaymentStatus,
    ReservationStatus,
    RuleType,
} from "@prisma/client";

import { stripe } from "@/lib/actions/stripe";

interface IParams {
    reservationId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<IParams> }
) {
    try {
        const user = await currentUser();

        if (!user) return new NextResponse(`Unauthorized`, { status: 401 });

        const { reservationId } = await params;

        if (!reservationId || typeof reservationId !== "string")
            return new NextResponse(`Invalid ID`, { status: 401 });

        const reservation = await prismadb.reservation.findUnique({
            where: {
                id: reservationId,
                status: ReservationStatus.pending,
            },
            select: {
                paymentIntent: true,
                status: true,
                paymentStatus: true,
                startDate: true,
                endDate: true,
                paymentAt: true,
                createdAt: true,
                totalPrice: true,
                listing: {
                    select: {
                        cancellationPolicy: {
                            select: {
                                rules: true,
                            },
                        },
                    },
                },
            },
        });

        if (!reservation || !reservation.paymentIntent)
            return new NextResponse(`No pending revservation found`, {
                status: 400,
            });

        if (
            reservation.status === ReservationStatus.completed ||
            reservation.status === ReservationStatus.canceled ||
            reservation.status === ReservationStatus.rejected
        )
            return new NextResponse(
                `Reservation already Completed/Cancelled/Rejected.`,
                { status: 400 }
            );

        if (reservation.paymentStatus === PaymentStatus.refunded)
            return new NextResponse(`Payment already refunded.`, {
                status: 400,
            });

        if (reservation.paymentStatus !== PaymentStatus.succeeded)
            return new NextResponse(`Payment not succeeded.`, { status: 400 });

        const cancelDate = new Date();
        // const cancelDate = addDays(new Date(), 3);

        const rules = reservation.listing.cancellationPolicy.rules;
        const checkInDate = reservation.startDate;
        const checkOutDate = reservation.endDate;
        const totalNights = calculateNightsBetween(checkInDate, checkOutDate);
        const daysBeforeCheckIn = calculateDaysBetween(cancelDate, checkInDate);
        const daysAfterBooking = calculateDaysBetween(
            reservation.paymentAt || reservation.createdAt,
            cancelDate
        );
        const stayLength = calculateDaysBetween(checkInDate, checkOutDate);

        const applicableRule = rules.find((rule) => {
            let daysBeforeCheckInCondition;

            if (rule.afterCheckIn) {
                daysBeforeCheckInCondition = true;
            } else {
                daysBeforeCheckInCondition =
                    (!rule.daysBeforeCheckIn ||
                        daysBeforeCheckIn >= rule.daysBeforeCheckIn) &&
                    (!rule.daysBeforeCheckInMax ||
                        daysBeforeCheckIn < rule.daysBeforeCheckInMax);
            }

            const daysAfterBookingCondition =
                !rule.daysAfterBooking ||
                daysAfterBooking <= rule.daysAfterBooking;

            const minStayLengthCondition =
                !rule.minStayLength || stayLength >= rule.minStayLength;

            return (
                daysBeforeCheckInCondition &&
                daysAfterBookingCondition &&
                minStayLengthCondition
            );
        });

        if (!applicableRule)
            return new NextResponse(`No applicable cancellation rule found`, {
                status: 400,
            });

        const refundAmount = calculateRefundAmount(
            applicableRule,
            totalNights,
            reservation.totalPrice,
            stayLength
        );

        if (refundAmount <= 0)
            return new NextResponse(`No refund applicable`, { status: 400 });

        if (refundAmount > reservation.totalPrice)
            return new NextResponse(`Please contact support !!!`, {
                status: 400,
            });

        const refund = await stripe.refunds.create({
            payment_intent: reservation.paymentIntent,
            amount: Math.round(refundAmount * 100),
        });

        if (refund.status !== "succeeded")
            return new NextResponse(
                `Unable to initial refund. Please contact admin`,
                { status: 400 }
            );

        await prismadb.reservation.update({
            where: {
                id: reservationId,
            },
            data: {
                status: ReservationStatus.canceled,
                paymentStatus: PaymentStatus.refunded,
                refundAmount,
            },
        });

        return NextResponse.json({ message: "Resersvation cancelled" });
    } catch (error) {
        return new NextResponse(`${error}`, { status: 500 });
    }
}

function calculateRefundAmount(
    rule: CancellationRule,
    totalNights: number,
    totalPrice: number,
    stayLength: number
) {
    const durationEligible = Math.min(stayLength + 1, totalNights);

    switch (rule.type) {
        case RuleType.FULL_REFUND:
            return totalPrice;

        case RuleType.NO_REFUND:
            return 0;

        case RuleType.PARTIAL_REFUND:
            switch (rule.paymentCalc) {
                case PaymentCalcType.PER_NIGHT_PLUS_ONE:
                    return (
                        totalPrice -
                        (durationEligible / totalNights) * totalPrice
                    );

                case PaymentCalcType.PER_NIGHT_PLUS_HALF_UNSPENT:
                    const unspentNightsPercent = 0.5;

                    return (
                        totalPrice -
                        durationEligible * (totalPrice / totalNights) -
                        (totalNights - durationEligible) *
                            unspentNightsPercent *
                            (totalPrice / totalNights)
                    );

                case PaymentCalcType.NEXT_30_NIGHTS:
                    const nightsToCharge = Math.min(
                        totalNights + 30,
                        totalNights
                    );
                    return (
                        totalPrice - (nightsToCharge / totalNights) * totalPrice
                    );

                default:
                    return ((rule.refundPercent || 0) / 100) * totalPrice;
            }

        default:
            return ((rule.refundPercent || 0) / 100) * totalPrice;
    }
}

function calculateNightsBetween(start: Date, end: Date) {
    return differenceInCalendarDays(end, start);
}

function calculateDaysBetween(start: Date, end: Date) {
    return differenceInDays(end, start);
}
