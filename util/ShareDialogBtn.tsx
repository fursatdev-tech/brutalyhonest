import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  text: string;
};

const ShareDialogBtn = ({ icon: Icon, text }: Props) => {
  return (
    //only inline style are working for padding
    <div
      className="w-full border-2 flex items-center justify-start gap-4 rounded-xl transition"
      style={{ padding: "1rem" }}
    >
      <Icon className="h-10 w-10" />
      <span className="text-base font-semibold">{text}</span>
    </div>
  );
};

export default ShareDialogBtn;
