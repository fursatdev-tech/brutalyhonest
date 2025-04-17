import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { config } from "@/components/emails/tailwind.email.config";
import { BASE_URL } from "@/util/constants";

const RequestToBookEmail = ({
  hostName = "partner",
  company = "BrutalyHonest",
  guestName = "Guest User",
  listingName = "Property Name",
  transactionDetails,
}: RequestToBookEmailProps) => {
  const previewText = `New booking request for ${listingName} on ${company}.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind config={config}>
        <Body className="border-2 border-solid border-border rounded-xl mx-auto p-10 w-[500px] font-sans">
          <Container className="p-5">
            <Section>
              <Img
                src={`${BASE_URL}/images/logo.png`}
                width="80"
                height="80"
                alt="BrutalyHonest Logo"
              />
            </Section>
            <Heading className="mx-0 my-8 p-0 text-2xl font-bold">
              New Booking Request
            </Heading>
            <Text className="text-sm">Hello {hostName},</Text>
            <Text className="text-sm">
              {guestName} has booked your property <b>{listingName} </b>
              on {company}. Below are the details of your transaction:
            </Text>

            <Section className="mt-[32px]">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="border  border-border p-2">
                      Transaction ID:
                    </td>
                    <td className="border border-border p-2 font-bold">
                      {transactionDetails.transactionId}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">Amount Paid:</td>
                    <td className="border border-border p-2 font-bold">
                      {transactionDetails.amountPaid}
                    </td>
                  </tr>
                  {/* Add more transaction details as needed */}
                </tbody>
              </table>
            </Section>
            <Section className="mb-8 mt-8">
              <Button
                className="rounded-lg bg-primary px-10 py-4 font-semibold text-background no-underline"
                href={`${BASE_URL}/hosting/inbox`}
              >
                Review Request
              </Button>
            </Section>
            <Text className="text-sm">
              Best regards,
              <br />
              The {company} Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

interface RequestToBookEmailProps {
  hostName?: string;
  company?: string;
  guestName?: string;
  listingName?: string;
  transactionDetails: {
    transactionId: string;
    amountPaid: string;
  };
}

export default RequestToBookEmail;
