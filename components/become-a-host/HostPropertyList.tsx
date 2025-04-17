import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { FaEye } from "react-icons/fa6";

import GetStarted from "@/components/become-a-host/dialog/GetStarted";
import { SafeProperty } from "@/util/types";
import PropertyCard from "@/components/become-a-host/PropertyCard";
import CopyLinkToPrperties from "@/components/become-a-host/CopyLinkToPrperties";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

interface Props {
  properties: SafeProperty[];
}

const HostPropertyList = async ({ properties }: Props) => {
  const baseUrl = process.env.META_URL;

  const user = await currentUser();
  const username = user?.username || "";

  return (
    <Container className="max-w-2xl mx-auto space-y-8 pb-28">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <p className="font-bold text-lg">My Travel Guides</p>
        <div className="flex gap-4 items-center">
          <CopyLinkToPrperties baseUrl={baseUrl} username={username} />
          <Link href={`/${username}`} target="_blank">
            <Button size="icon" variant="outline">
              <FaEye />
            </Button>
          </Link>
          <GetStarted icon title="Create listing" />
        </div>
      </div>

      {properties.map((property) => (
        <PropertyCard key={property.id} data={property} />
      ))}
    </Container>
  );
};

export default HostPropertyList;
