import React from "react";

interface Props {
  isPositive: boolean;
}

const OptionsHeader = ({ isPositive }: Props) => {
  const title = isPositive ? "Tell us what stood out" : "Tell us what happend";

  const subtitle = isPositive ? "" : "Choose one or more of these to continue.";

  return (
    <div className="space-y-2">
      <p className="text-lg font-bold">{title}</p>
      <p className="text-muted text-sm">{subtitle}</p>
    </div>
  );
};

export default OptionsHeader;
