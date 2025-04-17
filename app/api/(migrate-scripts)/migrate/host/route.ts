import { NextResponse } from "next/server";
import { ActionCategories, ActionTypes, PriceBreakup } from "@prisma/client";

import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const listings = await prismadb.listing.findMany({
      where: {},
      select: {
        id: true,
        title: true,
        hostId: true,
        b2bPrice: true,
        pgB2bPrice: true,
        host: {
          select: {
            hostEmail: true,
            name: true,
          },
        },
      },
    });

    for (const listing of listings) {
      const reservations = await prismadb.reservation.findMany({
        where: {
          listingId: listing.id,
        },
        select: {
          nights: true,
          id: true,
          userId: true,
          createdAt: true,
          priceBreakup: true,
        },
      });

      if (!reservations.length) continue;

      for (const reservation of reservations) {
        await createTransfers(
          listing.id,
          reservation.id,
          reservation.nights,
          listing?.b2bPrice?.inr || "0",
          listing?.pgB2bPrice?.inr || "0",
          reservation.createdAt,
          reservation?.priceBreakup?.basePrice || 0
        );
      }
    }

    return NextResponse.json("Received. Done");
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, {
      status: 500,
    });
  }
}

const createTransfers = async (
  listingId: string,
  reservationId: string,
  nights: number,
  b2bPrice: string | null,
  pgB2bPrice: string | null,
  createdAt: Date,
  totalPrice: number
) => {
  const accounts = await prismadb.listing.findUnique({
    where: { id: listingId },
    select: {
      host: {
        select: {
          id: true,
          user: {
            select: {
              stripeAccount: {
                select: { stripeAccountId: true },
              },
            },
          },
        },
      },
      coHost: {
        select: {
          host: {
            select: {
              id: true,
              user: {
                select: {
                  stripeAccount: {
                    select: { stripeAccountId: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const brutalyhonestFee = parseInt(
    process.env.NEXT_PUBLIC_brutalyhonest_SERVICE_FEE_PER || "5"
  );
  const brutalyhonestFeePer = brutalyhonestFee / 100;

  const priceBreakUp = await prismadb.priceBreakup.findUnique({
    where: {
      reservationId,
    },
    select: {
      extraGuestCharges: true,
      basePrice: true,
    },
  });

  if (!priceBreakUp) return;

  const hostId = accounts?.host.id!;

  const coHostIds = accounts?.coHost.map(({ host }) => {
    return host.id;
  });

  const cohostStripeAcountIds = accounts?.coHost.map(({ host }) => {
    return host?.user?.stripeAccount?.stripeAccountId;
  });

  const hostBasePayment =
    priceBreakUp.basePrice - parseInt(b2bPrice || "0") * nights;

  const hostExtraGuestCharges = priceBreakUp.extraGuestCharges
    ? parseInt(pgB2bPrice || "0") * nights
    : 0;

  const hostPayment = hostBasePayment + hostExtraGuestCharges;

  await prismadb.revenue.create({
    data: {
      hostEarning: hostPayment,
      earning: totalPrice,
      reservationId,
      hostId,
      createdAt,
    },
  });

  await createCoHostTransfers(
    cohostStripeAcountIds,
    reservationId,
    hostBasePayment,
    brutalyhonestFeePer,
    hostExtraGuestCharges,
    priceBreakUp,
    coHostIds
  );
};

const createCoHostTransfers = async (
  cohostStripeAcountIds: (string | undefined)[] | undefined,
  reservationId: string,
  hostBasePayment: number,
  brutalyhonestFeePer: number,
  hostExtraGuestCharges: number,
  priceBreakUp: Pick<PriceBreakup, "basePrice" | "extraGuestCharges">,
  coHostIds?: string[]
) => {
  if (!cohostStripeAcountIds?.length) return;

  const cohostBasePayment =
    priceBreakUp.basePrice -
    hostBasePayment -
    priceBreakUp.basePrice * brutalyhonestFeePer;

  const cohostextraGuestCharges =
    priceBreakUp.extraGuestCharges -
    hostExtraGuestCharges -
    priceBreakUp.extraGuestCharges * brutalyhonestFeePer;

  const perCohostPayment = (
    (cohostBasePayment + cohostextraGuestCharges) /
    cohostStripeAcountIds.length
  ).toFixed(2);

  cohostStripeAcountIds.forEach(async (stripeAccountId, idx) => {
    if (!stripeAccountId || parseInt(perCohostPayment) < 0) return;

    if (coHostIds && coHostIds[idx])
      await prismadb.revenue.update({
        where: {
          reservationId,
        },
        data: {
          cohost: {
            create: {
              hostId: coHostIds[idx],
            },
          },
          coHostEarning: parseFloat(perCohostPayment),
        },
      });
  });
};
