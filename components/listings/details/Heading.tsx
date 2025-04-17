import { cn } from "@/lib/utils";

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

const Heading = ({ title, subtitle, center, className }: HeadingProps) => {
  return (
    <div className={cn("text-start", center && "text-center", className)}>
      <h1 className="!text-2xl font-bold">{title}</h1>
      {/* <div className="font-light text-muted mt-2">{subtitle}</div> */}
    </div>
  );
};

export default Heading;
