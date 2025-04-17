import { NextResponse } from "next/server";
import { differenceInHours } from "date-fns";
import { PaymentStatus, ReservationStatus } from "@prisma/client";

import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const reservations = await prismadb.reservation.findMany({
      where: {
        status: ReservationStatus.pending,
        paymentStatus: PaymentStatus.succeeded,
      },
      select: {
        id: true,
        paymentAt: true,
        createdAt: true,
      },
    });

    for (const reservation of reservations) {
      if (
        reservation.paymentAt &&
        differenceInHours(new Date(), new Date(reservation.paymentAt)) > 24
      )
        await prismadb.reservation.update({
          where: {
            id: reservation.id,
          },
          data: {
            status: ReservationStatus.rejected,
          },
        });
    }

    return NextResponse.json({ data: "Done" });
  } catch (error: any) {
    return new NextResponse(`${JSON.stringify(error)}`, { status: 500 });
  }
}
