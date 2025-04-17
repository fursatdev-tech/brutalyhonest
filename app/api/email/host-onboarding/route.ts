import HostOnboarding from "@/components/emails/HostOnboarding";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const { cohostName, hostName, listingName, listingId, hostEmail } = body;

    const data = await resend.emails.send({
      from: "BrutalyHonest <hello@brutalyhonest.ai>",
      to: [hostEmail],
      subject: `${cohostName} thinks you are a great Host!`,
      react: HostOnboarding({
        cohostName,
        hostName,
        listingName,
        listingId,
      }),
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
