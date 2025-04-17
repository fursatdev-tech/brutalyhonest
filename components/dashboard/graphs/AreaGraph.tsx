"use client";
import { AreaChart } from "@tremor/react";

interface Props {
  data: {
    Month: string;
    Sales: number;
    Earnings: number;
  }[];
}

const AreaGraph = ({ data }: Props) => {
  if (!data.length)
    return (
      <p className="h-[300px] flex items-center justify-center font-semibold">
        Not enough data to display.
      </p>
    );

  return (
    <div className="mt-6">
      {/* Tremor style load fix */}
      <>
        <div className="stroke-primary border border-tremor-border rounded-tremor-default text-tremor-label text-tremor-content mr-1.5 hidden shadow-tremor-dropdown px-4 py-2 text-tremor-content-emphasis text-blue-500 bg-blue-500 text-tremor-default shadow-tremor-card border-tremor-background tabular-nums rounded-tremor-full whitespace-nowrap fill-blue-500 stroke-blue-500 space-x-8"></div>
      </>

      <AreaChart
        className="h-80"
        data={data}
        categories={["Sales", "Earnings"]}
        index="Month"
        colors={["primary", "blue"]}
        valueFormatter={(number: number) =>
          `$ ${Intl.NumberFormat("us").format(number).toString()}`
        }
        yAxisWidth={90}
        showAnimation={true}
      />
    </div>
  );
};

export default AreaGraph;
