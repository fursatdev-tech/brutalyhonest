import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { ReservationStatus } from "@prisma/client";

export async function GET() {
  try {
    await prismadb.reservation.updateMany({
      where: {
        status: ReservationStatus.confirmed,
        endDate: { lte: new Date() },
      },
      data: {
        status: ReservationStatus.completed,
      },
    });

    return NextResponse.json({ data: "Done" });
  } catch (error: any) {
    return new NextResponse(`${JSON.stringify(error)}`, { status: 500 });
  }
}
