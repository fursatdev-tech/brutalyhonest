import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

import { PriceBreakup, ReservationStatus } from "@prisma/client";

export async function GET() {
  try {
    const reservations = await prismadb.reservation.findMany({
      where: {
        startDate: { lte: new Date() },
        status: ReservationStatus.confirmed,
      },
      select: {
        listingId: true,
        nights: true,
        id: true,
        listing: {
          select: {
            b2bPrice: true,
            pgB2bPrice: true,
          },
        },
        priceBreakup: {
          select: {
            basePrice: true,
          },
        },
      },
    });

    for (const reservation of reservations) {
      await createTransfers(
        reservation.listingId,
        reservation.id,
        reservation.nights,
        reservation.listing?.b2bPrice?.inr || "0",
        reservation.listing?.pgB2bPrice?.inr || "0",
        reservation?.priceBreakup?.basePrice || 0
      );
    }

    return NextResponse.json({ data: "Done" });
  } catch (error: any) {
    return new NextResponse(`${JSON.stringify(error)}`, { status: 500 });
  }
}

const createTransfers = async (
  listingId: string,
  reservationId: string,
  nights: number,
  b2bPrice: string | null,
  pgB2bPrice: string | null,
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

  const hostStripeAcountId =
    accounts?.host.user?.stripeAccount?.stripeAccountId;

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
      reservationId,
      hostId,
      earning: totalPrice,
    },
  });

  await createHostTransfer(hostPayment, reservationId, hostStripeAcountId);

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

const createHostTransfer = async (
  amount: number,
  reservationId: string,
  hostStripeAcountId?: string
) => {
  if (!hostStripeAcountId || amount < 0) return;

  // await stripe.transfers.create({
  //   currency: CURRENCY,
  //   amount: amount * 100,
  //   destination: hostStripeAcountId,
  //   transfer_group: reservationId,
  // });
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

    // await stripe.transfers.create({
    //   currency: CURRENCY,
    //   amount: parseFloat(perCohostPayment) * 100,
    //   destination: stripeAccountId,
    //   transfer_group: reservationId,
    // });
  });
};
