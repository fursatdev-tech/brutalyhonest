import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Cors from "micro-cors";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/actions/stripe";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET_CONNECT!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);

    if (event.type !== "account.updated")
      return NextResponse.json("Unhandled event type");

    const { id: stripeAccountId, charges_enabled: chargesEnabled } =
      event.data.object;

    await prismadb.stripeAccount.update({
      where: { stripeAccountId },
      data: { chargesEnabled: Boolean(chargesEnabled) },
    });

    return NextResponse.json("Received");
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: 500,
    });
  }
}
