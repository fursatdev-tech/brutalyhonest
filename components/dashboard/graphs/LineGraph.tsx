"use client";
import { ITransformedData } from "@/lib/actions/getListingsPageViews";
import { CustomTooltipProps, LineChart } from "@tremor/react";

interface Props {
  data: ITransformedData[];
}

const LineGraph = ({ data }: Props) => {
  if (!data.length)
    return (
      <p className="h-[300px] flex items-center justify-center font-semibold">
        Not enough data to display.
      </p>
    );

  const dataFormatter = (number: number) => `${number}`;

  const customTooltip = (props: CustomTooltipProps) => {
    const { payload, active, label } = props;

    if (!active || !payload) return null;

    return (
      <div className="w-56 rounded-tremor-default border border-tremor-border stroke-tremor-border  bg-tremor-background p-2 text-tremor-default shadow">
        {payload.map((category, idx: number) => (
          <div key={idx} className="flex flex-1 space-x-2.5">
            <div className={`flex w-1 flex-col bg-${category.color} rounded`} />
            <div className="space-y-1">
              <p className="text-tremor-content">{label}</p>
              <p className="font-medium text-tremor-content-emphasis">
                {category.value} page views
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <div className="stroke-primary rounded-tremor-default text-tremor-label"></div>

      <LineChart
        className="h-60 md:h-80"
        data={data}
        index="name"
        categories={["value"]}
        colors={["primary"]}
        yAxisWidth={20}
        showAnimation={true}
        showLegend={false}
        valueFormatter={dataFormatter}
        customTooltip={customTooltip}
      />
    </div>
  );
};

export default LineGraph;
