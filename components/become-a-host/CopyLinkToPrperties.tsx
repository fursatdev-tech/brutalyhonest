"use client";
import { FaShareAlt } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import copyToClipboard from "@/lib/copyToClipboard";

interface Props {
  baseUrl: string | undefined;
  username: string;
}

const CopyLinkToPrperties = ({ baseUrl, username }: Props) => {
  const isMobile = window?.innerWidth < 768;

  const link = `${baseUrl}/${username}`;

  const copyLink = async () => {
    if (isMobile)
      return navigator?.share({
        title: `Listings by ${username}`,
        url: link,
      });

    copyToClipboard({ link }), [link];
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={copyLink}
      aria-label="Copy link to properties"
    >
      <FaShareAlt />
    </Button>
  );
};

export default CopyLinkToPrperties;
