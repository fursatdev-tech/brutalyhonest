"use client";

import { Pie, PieChart, ResponsiveContainer } from "recharts";

interface Props {
  data: {
    matrix: string;
    count: number;
  }[];
}

const PieGraph = ({ data }: Props) => {
  if (!data || data?.length < 1)
    return (
      <p className="h-[300px] flex items-center justify-center font-semibold">
        Not enough data to display.
      </p>
    );

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    index,
  }: ILabel) => {
    const radius = outerRadius + 10;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fill="#737373"
      >
        {`${data[index].matrix}: ${data[index].count}`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="matrix"
          innerRadius={70}
          outerRadius={120}
          fill="#008080"
          label={renderCustomizedLabel}
          labelLine={false}
          style={{ outline: "none" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieGraph;

interface ILabel {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  index: number;
}
