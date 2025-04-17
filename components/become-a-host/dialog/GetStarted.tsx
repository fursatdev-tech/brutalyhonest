"use client";
import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";

import { toast } from "@/components/ui/use-toast";
import { getPropertyId } from "@/util/routes";
import { showError } from "@/util/catchError";

interface Props {
  title?: string;
  icon?: boolean;
}

const GetStarted = ({ title = "Get started today", icon = false }: Props) => {
  const [airbnbUrl, setAirbnbUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const navigate = async () => {
    const validUrl = airbnbUrl.split("?")[0];

    if (!validUrl)
      return toast({
        title: "Please enter a valid URL",
        description: airbnbUrl,
        duration: 5000,
      });

    setLoading(true);

    try {
      const res = await axios.post(getPropertyId, { url: validUrl });

      const { propertyId, isBookingUrl } = res.data;

      router.push(
        `/become-a-host/property-type?url=${propertyId}&isBookingUrl=${isBookingUrl}`
      );
    } catch (error) {
      setLoading(false);
      showError(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {icon ? (
          <Button>
            <FaPlus className="mr-2" /> {title}
          </Button>
        ) : (
          <Button size="lg" className="w-full md:w-fit">
            {title}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle>Earn by sharing your travel guide</DialogTitle>
          <DialogDescription>
            Begin by entering the URL of a youtube travel vlog below
            {/* If you
            don&apos;t have the link handy, don&apos;t worry — you can still
            list a cherished holiday by following a few simple steps. */}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <Input
            id="link"
            disabled={loading}
            value={airbnbUrl}
            onChange={(e) => setAirbnbUrl(e.target.value)}
            placeholder="Enter a Youtube video URL"
          />

          <Button
            size="lg"
            className="w-full"
            disabled={!airbnbUrl || loading}
            onClick={navigate}
            loading={loading}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetStarted;
