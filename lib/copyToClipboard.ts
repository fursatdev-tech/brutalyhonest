import { toast } from "@/components/ui/use-toast";

interface Props {
  link: string;
}

const copyToClipboard = async ({ link }: Props) => {
  await navigator.clipboard.writeText(link);

  toast({
    title: "Link copied",
    description: "You can now share this link with your friends",
    duration: 3000,
  });
};

export default copyToClipboard;
