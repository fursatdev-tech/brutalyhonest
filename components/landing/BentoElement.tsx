import { IconType } from "react-icons";

interface Props {
  text?: string;
  icon: IconType;
}

const BentoElement = ({ text, icon: Icon }: Props) => {
  return (
    <div className="rounded-2xl px-3 py-6 text-center bg-secondary text-background flex-1">
      <div className="space-y-3">
        <Icon size="48" className="mx-auto" />
        <p>{text}</p>
      </div>
    </div>
  );
};

export default BentoElement;
