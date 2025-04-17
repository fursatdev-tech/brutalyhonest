"use client";
import { ITransformedData } from "@/lib/actions/getListingsPageViews";
import { BarList } from "@tremor/react";

interface Props {
  data: ITransformedData[];
}

const PageViewGraph = ({ data }: Props) => {
  if (!data.length)
    return (
      <p className="h-[300px] flex items-center justify-center font-semibold">
        Not enough data to display.
      </p>
    );

  return (
    <>
      <div className="bg-tremor-brand-subtle rounded-tremor-small text-tremor-default"></div>
      <div className="flex justify-between mt-6 text-sm text-muted-foreground gap-4">
        <p>Name</p>
        <p>Views</p>
      </div>

      <BarList
        data={data}
        valueFormatter={(number: number) =>
          Intl.NumberFormat("us").format(number).toString()
        }
        className="mt-2 gap-4"
        showAnimation={true}
      />
    </>
  );
};

export default PageViewGraph;
