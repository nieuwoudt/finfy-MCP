"use client";

import React, { FC } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useDynamicChart } from "@/hooks";
import { formatSnakeCaseToTitleCase, isObject } from "@/utils/helpers";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface DynamicChartProps {}

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const calculateTotal = (data: any): number => {
  let total = 0;

  for (const key in data) {
    if (typeof data[key] === "object" && data[key] !== null) {
      total += calculateTotal(data[key]);
    } else if (typeof data[key] === "number") {
      total += data[key];
    }
  }

  return total;
};

const getDataForChart = (chart: any) => {
  if (chart) {
    const totalData = Object.entries(chart).find(
      ([key]: any) => key === "total_spending"
    );
    // ?.map(([key, data]: any) => ({
    //   label: [formatSnakeCaseToTitleCase(key)],
    //   backgroundColor: [getRandomColor()],
    //   data: [isObject(data) ? calculateTotal(data) : data],
    // }));

    const data = Object.entries(chart)
      .filter(([key]) => key !== "total_spending")
      .reduce(
        (item: any, [key, data]: any) => {
          item.label = [...item.label, formatSnakeCaseToTitleCase(key)];
          item.backgroundColor = [...item.backgroundColor, getRandomColor()];
          item.data = [
            ...item.data,
            isObject(data) ? calculateTotal(data) : data,
          ];

          return item;
        },
        {
          label: [],
          backgroundColor: [],
          data: [],
        }
      );
    return {
      labels: [],
      datasets: totalData
        ? [
            {
              label: [formatSnakeCaseToTitleCase(totalData.at(0) as string)],
              backgroundColor: [getRandomColor()],
              data: [totalData.at(1)],
            },
            data,
          ]
        : [data],
    };
  }
  return { labels: [], datasets: [] };
};

const DynamicChart: FC<DynamicChartProps> = () => {
  const { charts } = useDynamicChart();
  const data: any = getDataForChart(charts);

  if (!data?.datasets?.at(0)?.data?.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-white">Dynamic Multi-Series Pie Chart</h2>
      <Pie data={data} />
    </div>
  );
};

export { DynamicChart };
