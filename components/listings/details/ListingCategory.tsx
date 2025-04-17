import { IconType } from "react-icons";

interface ListingCategoryProps {
  icon: IconType;
  label: string;
  description: string;
}

const ListingCategory = ({
  icon: Icon,
  label,
  description,
}: ListingCategoryProps) => {
  return (
    <div className="flex items-center gap-4">
      <Icon size={40} className="text-secondary-foreground" />
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-muted font-light text-sm">{description}</div>
      </div>
    </div>
  );
};

export default ListingCategory;
