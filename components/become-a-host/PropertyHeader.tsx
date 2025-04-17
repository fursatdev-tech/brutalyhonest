interface Props {
  title: string;
  subtitle: string;
}

const PropertyHeader = ({ title, subtitle }: Props) => {
  return (
    <div className="text-center space-y-2">
      <p className="font-bold text-2xl md:text-3xl">{title}</p>
      <p className="text-sm md:text-base">{subtitle}</p>
    </div>
  );
};

export default PropertyHeader;
