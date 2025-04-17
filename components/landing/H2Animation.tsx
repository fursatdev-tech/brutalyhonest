import { cn } from "@/lib/utils";

export interface Props {
  text?: string;
}

const H2Animation = ({ text }: Props) => {
  return (
    <>
      <p className="sr-only">{text}</p>

      <p className="text-xl md:text-2xl font-semibold text-muted-foreground overflow-hidden not-sr-only">
        <span className={cn("inline-flex")}>{text}</span>
      </p>
    </>
  );
};

export default H2Animation;
