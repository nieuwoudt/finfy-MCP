"use client";

import React, { FC } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useDynamicChart } from "@/hooks";
import { ExpenseChart } from "../ExpenseChart";
import { GroupedBarChart } from "../GroupedBarChart";
import { SpendingChart } from "../SpendingBarChart";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface DynamicChartProps { selectedChartId: any }

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Chart: any = {
  spending_by_primary_secondary_date: ({ data }: any) => {
    return <GroupedBarChart data={data} />;
  },
  spending_by_primary_secondary: ({ data }: any) => {
    return <GroupedBarChart data={data} />;
  },
};

// const chart: any = {
//   total_spending: <></>,
//   spending_by_primary_category: <></>,
//   spending_by_primray_category_percentage: <></>,
//   spending_by_primary_secondary: <></>,
//   spending_by_date: <></>,
//   spending_by_primary_secondary_date: ExpenseChart,
//   spending_by_transaction_type: <></>,
// };

const DynamicChart: FC<DynamicChartProps> = ({ selectedChartId }) => {
  const { charts } = useDynamicChart();

  if (!selectedChartId || !charts[selectedChartId]) {
    return null;
  }

  const chartData = charts[selectedChartId];
  return (
    <div>
      <SpendingChart data={chartData} />
    </div>
  );
};

export { DynamicChart };
