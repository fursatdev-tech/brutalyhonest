import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import Cors from 'micro-cors'
import {
  ActionCategories,
  ActionTypes,
  PaymentStatus,
  PriceBreakup,
} from '@prisma/client'
import axios from 'axios'

import prismadb from '@/lib/prismadb'
import { stripe } from '@/lib/actions/stripe'
import { MODE_URL } from '@/util/constants'

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
})

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret)

    if (
      event.type !== 'checkout.session.completed' &&
      event.type !== 'checkout.session.expired' &&
      event.type !== 'checkout.session.async_payment_failed'
    )
      return NextResponse.json('Unhandled event type')

    const metadata = event.data.object.metadata

    const paymentIntent = event.data.object.payment_intent as string

    if (!metadata) return NextResponse.json('No metadata')

    const {
      listingId = '',
      reservationId = '',
      clerkId = '',
      tourId = '',
    } = metadata

    const user = await prismadb.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        clerkId: true,
      },
    })

    if (!user) return NextResponse.json('USER NOT FOUND')

    if (
      event.type === 'checkout.session.expired' ||
      event.type === 'checkout.session.async_payment_failed'
    ) {
      await updateReservationPayFail(reservationId, paymentIntent, tourId)

      return NextResponse.json('Received')
    }

    const reservation = await updateReservationPaySuccess(
      reservationId,
      paymentIntent,
      tourId
    )

    if (tourId) return NextResponse.json('Received. Tour. Done')

    const listing = await prismadb.listing.findUnique({
      where: {
        id: listingId,
      },
      select: {
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
    })

    if (!listing) return NextResponse.json('LISTING NOT FOUND')

    await prismadb.message.create({
      data: {
        reservationId: reservation.id,
        listingId,
        thread: {
          create: {
            text: 'New reservation request!',
            actions: [
              { type: ActionTypes.btnAccept, label: 'Accept' },
              { type: ActionTypes.btnReject, label: 'Decline' },
            ],
            actionCategory: ActionCategories.approval,
            guestId: reservation.userId,
            hostId: listing.hostId,
          },
        },
      },
    })

    await axios.post(`${MODE_URL}/api/email/review-request`, {
      email: listing.host.hostEmail,
      guestName: event.data.object.customer_details?.name,
      name: listing.host.name,
      listingName: listing.title,
      transactionId: event.data.object.id,
      amountPaid: event.data.object.amount_total,
    })

    return NextResponse.json('Received. Done')
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: 500,
    })
  }
}

const updateReservationPayFail = async (
  reservationId: string,
  paymentIntent: string,
  tourId: string
) => {
  if (tourId)
    return await prismadb.tourReservation.update({
      where: {
        id: reservationId,
      },
      data: {
        paymentIntent,
        paymentStatus: PaymentStatus.failed,
      },
    })

  return await prismadb.reservation.update({
    where: {
      id: reservationId,
    },
    data: {
      paymentIntent,
      paymentStatus: PaymentStatus.failed,
    },
  })
}

const updateReservationPaySuccess = async (
  reservationId: string,
  paymentIntent: string,
  tourId: string
) => {
  if (tourId)
    return await prismadb.tourReservation.update({
      where: {
        id: reservationId,
      },
      data: {
        paymentIntent,
        paymentStatus: PaymentStatus.succeeded,
        paymentAt: new Date(),
      },
    })

  return await prismadb.reservation.update({
    where: {
      id: reservationId,
    },
    data: {
      paymentIntent,
      paymentStatus: PaymentStatus.succeeded,
      paymentAt: new Date(),
    },
    include: {
      priceBreakup: true,
    },
  })
}
