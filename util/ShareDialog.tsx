import { FaRegShareFromSquare } from "react-icons/fa6";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookMessengerShareButton,
  LinkedinShareButton,
} from "react-share";
import { CiMail, CiFacebook, CiLinkedin } from "react-icons/ci";
import { PiWhatsappLogoLight, PiMessengerLogoLight } from "react-icons/pi";
import { RiTwitterXLine } from "react-icons/ri";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { IoCopyOutline } from "react-icons/io5";
import Image from "next/image";

import ShareDialogBtn from "@/util/ShareDialogBtn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import copyToClipboard from "@/lib/copyToClipboard";

type Props = {
  title: string;
  url: string;
  image: string;
};

const ShareDialog = ({ title, url, image }: Props) => {
  if (url) url = window.location.href;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-secondary">
          <FaRegShareFromSquare className="h-4 w-4 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader className="space-y-8">
          <DialogTitle>Share this place</DialogTitle>
          <DialogDescription asChild>
            <>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 relative rounded-xl">
                  <Image
                    src={image}
                    alt="property"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
                <p className="text-left">{title}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-secondary">
                <div
                  className="cursor-pointer"
                  onClick={() => copyToClipboard({ link: url })}
                >
                  <ShareDialogBtn icon={IoCopyOutline} text="Copy link" />
                </div>

                <EmailShareButton url={url} title={title}>
                  <ShareDialogBtn icon={CiMail} text="Email" />
                </EmailShareButton>

                <FacebookShareButton url={url} title={title}>
                  <ShareDialogBtn icon={CiFacebook} text="Facebook" />
                </FacebookShareButton>

                <WhatsappShareButton url={url} title={title}>
                  <ShareDialogBtn icon={PiWhatsappLogoLight} text="WhatsApp" />
                </WhatsappShareButton>

                <FacebookMessengerShareButton appId="" url={url} title={title}>
                  <ShareDialogBtn
                    icon={PiMessengerLogoLight}
                    text="Messenger"
                  />
                </FacebookMessengerShareButton>

                <TwitterShareButton url={url} title={title}>
                  <ShareDialogBtn icon={RiTwitterXLine} text="Twitter (X)" />
                </TwitterShareButton>

                <LinkedinShareButton url={url} title={title}>
                  <ShareDialogBtn icon={CiLinkedin} text="LinkedIn" />
                </LinkedinShareButton>

                <div
                  onClick={() => navigator?.share({ title, url })}
                  className="cursor-pointer"
                >
                  <ShareDialogBtn
                    icon={PiDotsThreeOutlineLight}
                    text="More options"
                  />
                </div>
              </div>
            </>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
