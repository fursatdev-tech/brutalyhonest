"use client";
import { TbCopy } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import copyToClipboard from "@/lib/copyToClipboard";
import { cn } from "@/lib/utils";

interface Props {
  link: string;
  username: string;
  varient?: "link" | "default";
}

const ToursCopyLink = ({ link, username, varient = "default" }: Props) => {
  const isMobile = window?.innerWidth < 768;

  const copyLink = async () => {
    if (isMobile)
      return navigator?.share({
        title: `Survey by ${username}`,
        url: link,
      });

    copyToClipboard({ link }), [link];
  };

  return (
    <Button
      className={cn("w-fit", varient === "link" && "text-primary p-0")}
      size="lg"
      onClick={copyLink}
      variant={varient}
    >
      Copy Survey Link <TbCopy className="ms-3 h-5 w-5" />
    </Button>
  );
};

export default ToursCopyLink;
