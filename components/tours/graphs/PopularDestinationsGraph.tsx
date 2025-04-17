"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IoBarChart } from "react-icons/io5";
import { GRAPH_TICK } from "@/util/constants";

export type DestinationCount = Record<string, number>;

interface Props {
  destinationCounts: DestinationCount[];
}

const PopularDestinationsGraph = ({ destinationCounts }: Props) => {
  const destinations = Object.entries(destinationCounts)
    .map(([name, count]) => {
      return { name, count: Number(count) };
    })
    .sort((a, b) => b.count - a.count);

  if (destinations?.length < 2)
    return (
      <p className="text-2xl h-48 flex gap-2 items-center justify-center font-semibold">
        <IoBarChart /> As you collect survey responses, they will populate here.
      </p>
    );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={destinations}
        margin={{
          bottom: 60,
        }}
      >
        <XAxis dataKey="name" tick={GRAPH_TICK} angle={-45} textAnchor="end" />
        <YAxis tick={GRAPH_TICK} />
        <Tooltip />
        <Bar dataKey="count" fill="#008080" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PopularDestinationsGraph;
