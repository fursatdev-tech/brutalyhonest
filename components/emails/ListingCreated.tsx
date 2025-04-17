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

import { BASE_URL } from "@/util/constants";
import { config } from "@/components/emails/tailwind.email.config";

interface Props {
  name: string;
  company?: string;
  listingName: string;
  listingId: string;
}

const ListingCreated = ({
  name,
  company = "BrutalyHonest",
  listingName,
  listingId,
}: Props) => {
  const previewText = `Congratulations 🥳, ${name}! Your new listing on ${company} is now live.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind config={config}>
        <Body className="border-2 border-solid border-border rounded-xl mx-auto p-10 w-[500px]">
          <Container className="p-5">
            <Section>
              <Img
                src={`${BASE_URL}/images/logo.png`}
                width="148"
                height="60"
                alt="BrutalyHonest Logo"
                className="my-0"
              />
            </Section>
            <Heading className="mx-0 my-8 p-0 text-2xl font-normal">
              Congratulations, {name}!
            </Heading>
            <Text className="text-sm">
              Your new listing, <strong>{`${listingName}`}</strong> is now
              shared on {company}. Explore the possibilities and start receiving
              bookings.
            </Text>
            <Section className="mb-8 mt-8">
              <Button
                className="rounded-lg bg-primary px-10 py-4 font-semibold text-background no-underline"
                href={`${BASE_URL}/listings/${listingId}`}
              >
                View Listing
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

export default ListingCreated;
