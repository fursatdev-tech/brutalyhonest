import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaRegLightbulb } from "react-icons/fa";
import { cn } from '@/lib/utils';

interface PackageInfoDetailsProps {
  summary: string;
  guidesTips: string;
  className?: string;
}

const InfoCard = ({
  icon: Icon,
  title,
  content,
  iconClassName,
}: {
  icon: React.ElementType;
  title: string;
  content: string;
  iconClassName: string;
}) => (
  <Card className="">
    <CardContent className="pt-6">
      <div className="flex items-start gap-3">
        <Icon className={`flex-shrink-0 mt-1 w-6 h-6 ${iconClassName}`} />
        <div>
          <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
const PackageInfoDetails: React.FC<PackageInfoDetailsProps> = ({
  summary,
  guidesTips,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {summary.trim() ? (
        <InfoCard
          icon={IoInformationCircleOutline}
          title="Trip Overview"
          content={summary}
          iconClassName="text-primary"
        />
      ) : (
        <div></div>
      )}
      {summary.trim() ? (
        <InfoCard
          icon={FaRegLightbulb}
          title="Travel Tips"
          content={guidesTips}
          iconClassName="text-secondary w-5 h-5"
        />
      ) : (
        <div></div>
      )}
    </div>
  );
};
export default PackageInfoDetails;
