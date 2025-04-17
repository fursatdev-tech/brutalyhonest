import { cn } from "@/lib/utils";

interface PageProps {
  text: string;
  className?: string;
}

const PageHeaderH1 = ({ text, className }: PageProps) => {
  return <h1 className={cn("!text-2xl font-bold pb-5", className)}>{text}</h1>;
};

export default PageHeaderH1;
