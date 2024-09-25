"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Chart } from "@/components/atoms";
import { ChartConfig } from "@/types";

const chartData = [
  { category: "Bank Fees", amount: 420 },
  { category: "Entertainment", amount: 280 },
  { category: "General Services", amount: 375 },
  { category: "Income", amount: 300 },
];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#515AD9",
  },
} satisfies ChartConfig;

export function BarChartPrimaryCategory() {
  return (
    <Chart config={chartConfig} className="min-h-[200px] w-full">
      <BarChart width={300} height={100} data={chartData}>
        <CartesianGrid vertical={false} strokeDasharray="8 8" />
        {/* <XAxis
          dataKey="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis /> */}
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="var(--color-amount)" radius={[50, 50, 0, 0]} />
      </BarChart>
    </Chart>
  );
}
