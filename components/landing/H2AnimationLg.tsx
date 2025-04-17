import { cn } from "@/lib/utils";

export interface Props {
  text?: string;
}

const H2AnimationLg = ({ text }: Props) => {
  return (
    <>
      <p className="sr-only">{text}</p>

      <p className="font-extrabold text-4xl md:text-5xl overflow-hidden not-sr-only pb-1">
        <span className={cn("inline-flex")}>{text}</span>
      </p>
    </>
  );
};

export default H2AnimationLg;
