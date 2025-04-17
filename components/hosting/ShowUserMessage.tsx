import { UserRole } from "@prisma/client";
import { format } from "date-fns";
import Markdown from "react-markdown";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeThread } from "@/util/types";

interface Props {
  data: SafeThread;
}

const ShowUserMessage = ({ data }: Props) => {
  const getImageSrc = () => {
    if (data.role === UserRole.host) return data?.host?.profilePhotoUrl;

    if (data.role === UserRole.guest) return data?.guest?.image;

    return "/images/ai-avatar.webp";
  };

  const getName = () => {
    if (data.role === UserRole.host) return `${data?.host?.name} (Host)`;

    if (data.role === UserRole.guest) return data?.guest?.name;

    return "BrutalyHonest AI";
  };

  const message = {
    __html: data?.text || "",
  };

  return (
    <div className={cn("flex items-start gap-4")}>
      <Avatar>
        <AvatarImage src={getImageSrc() ?? "/images/ai-avatar.webp"} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="w-full">
        <div className="flex gap-2 items-center">
          <p className="font-bold text-sm">{getName()}</p>
          <p className="text-muted-foreground text-xs font-light">
            {format(new Date(data.updatedAt), "p")}
          </p>
        </div>
        {/* <p dangerouslySetInnerHTML={message}></p> */}

        <Markdown>{data?.text}</Markdown>
      </div>
    </div>
  );
};

export default ShowUserMessage;
