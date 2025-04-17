import { Resend } from "resend";

import RequestToBookEmail from "@/components/emails/ReviewRequestEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const { hostName, listingName, email, guestName, transactionDetails } =
      body;

    const data = await resend.emails.send({
      from: "BrutalyHonest <hello@brutalyhonest.ai>",
      to: [email],
      subject: "New booking request",
      react: RequestToBookEmail({
        hostName,
        company: "BrutalyHonest",
        guestName,
        listingName,
        transactionDetails,
      }),
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
