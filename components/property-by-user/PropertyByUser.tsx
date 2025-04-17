import Listings from "@/components/listings/Listings";
import getHostByUsername from "@/lib/actions/getHostByUsername";
import { getListings } from "@/lib/actions/getListings";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { Button } from "../ui/button";
import CopyLinkToPrperties from "@/components/become-a-host/CopyLinkToPrperties";

interface Props {
  username?: string;
  category?: string;
  listing?: string;
}

const PropertyByUser = async (props: Props) => {
  const [listings, host] = await Promise.all([
    getListings(props),
    getHostByUsername(props.username!),
  ]);
  const baseUrl = process.env.META_URL;

  return (
    <div className="space-y-4 mt-5">
      {/* Profile Card */}
      <Card className="w-full max-w-md border-0 bg-background shadow-none">
        <CardContent className="flex items-center gap-3 p-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              alt="Profile picture"
              src={host?.profilePhotoUrl || "images/placeholder.jpg"}
            />
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-semibold leading-none">{host?.name}</h2>
            <p className="text-sm text-muted-foreground">@ {props.username}</p>
          </div>
          <CopyLinkToPrperties baseUrl={baseUrl} username={props.username!} />
          {/* <Button size="icon" variant="ghost" className="h-10 w-10">
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button> */}
        </CardContent>
      </Card>

      <Listings listings={listings} />
    </div>
  );
};

export default PropertyByUser;
