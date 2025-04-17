"use client";

import { FaRegCopy } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import copyToClipboard from "@/lib/copyToClipboard";

interface Props {
  username: string;
}

const CopyReferralLink = ({ username }: Props) => {
  const isMobile = window?.innerWidth < 768;

  const link = `https://brutalyhonest.ai/referral/${username}`;

  const copyLink = async () => {
    if (isMobile)
      return navigator?.share({
        title: `Listings by ${username}`,
        url: link,
      });

    copyToClipboard({ link }), [link];
  };

  return (
    <Button size="icon" className="rounded-lg" onClick={copyLink}>
      <FaRegCopy className="h-4 w-4" />
    </Button>
  );
};

export default CopyReferralLink;
