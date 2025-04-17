import { NextRequest, NextResponse } from "next/server";
import { CalendarEvent, ReservationStatus } from "@prisma/client";

import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const reservations = await prismadb.reservation.findMany({
      where: {
        OR: [
          {
            status: ReservationStatus.confirmed,
          },
          {
            status: ReservationStatus.completed,
          },
        ],
      },
      select: {
        startDate: true,
        endDate: true,
        nights: true,
        adults: true,
        children: true,
        infants: true,
        pets: true,
        listing: {
          select: {
            title: true,
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
      },
    });

    for (const reservation of reservations) {
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
        where: {
          hostId: reservation.listing.host.id,
        },
        create: {
          userId: reservation.listing.host.userId!,
          hostId: reservation.listing.host.id,
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
    }

    return NextResponse.json("Done.");
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, {
      status: 500,
    });
  }
}

export async function DELETE() {
  try {
    const allEvents = await prismadb.calendarEvent.findMany();

    const eventIdsToDelete: string[] = [];
    const uniqueEventCheck = new Set();

    allEvents.forEach((event) => {
      const uniqueKey = `${
        event.calendarId
      }-${event.start.toISOString()}-${event.end.toISOString()}-${event.title}`;
      if (uniqueEventCheck.has(uniqueKey)) {
        eventIdsToDelete.push(event.id);
      } else {
        uniqueEventCheck.add(uniqueKey);
      }
    });

    const deletionPromises = eventIdsToDelete.map((eventId) =>
      prismadb.calendarEvent.delete({
        where: { id: eventId },
      })
    );

    await Promise.all(deletionPromises);

    return NextResponse.json("Done.");
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, {
      status: 500,
    });
  }
}
