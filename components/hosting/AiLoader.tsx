import { BeatLoader } from "react-spinners";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AiLoader = () => {
  return (
    <div className={"flex items-start gap-4"}>
      <Avatar>
        <AvatarImage src="/images/ai-avatar.webp" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="px-6 py-1 border rounded-md bg-gray-50">
        <BeatLoader color={"black"} size={5} />
      </div>
    </div>
  );
};

export default AiLoader;
