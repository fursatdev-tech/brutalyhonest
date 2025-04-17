"use client";

import { GRAPH_TICK } from "@/util/constants";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    range: string;
    value: number;
  }[];
}

const BudgetAgeGraph = ({ data }: Props) => {
  if (data.length < 2)
    return (
      <p className="h-[300px] flex items-center justify-center font-semibold">
        Not enough data to display.
      </p>
    );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          bottom: 25,
        }}
      >
        <XAxis dataKey="range" tick={GRAPH_TICK} angle={-45} textAnchor="end" />
        <YAxis tick={GRAPH_TICK} />
        <Tooltip />
        <Bar dataKey="value" fill="#008080" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BudgetAgeGraph;
