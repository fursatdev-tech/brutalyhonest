import { cn } from "@/lib/utils";

interface Props {
  name: string;
  selected: boolean | undefined;
}

const OptionTags = ({ name, selected = false }: Props) => {
  return (
    <div
      className={cn(
        "border rounded-full px-4 py-2 text-xs cursor-pointer hover:bg-gray-100 transition font-semibold text-muted",
        selected && "bg-secondary text-primary-foreground hover:bg-black/75"
      )}
    >
      {name}
    </div>
  );
};

export default OptionTags;
