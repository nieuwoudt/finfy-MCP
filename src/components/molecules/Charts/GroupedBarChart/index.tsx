// components/GroupedBarChart.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
} from "chart.js";
import { formatSnakeCaseToTitleCase } from "@/utils/helpers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
);

interface GroupedBarChartProps {
  data: any;
}

const getDataset = (data: any, emptyArray: null[]) => {
  return Object.values(data)
    .map((item: any, index) => {
      console.log(item);
      return item.map((value: any) => {
        const data = [...emptyArray] as any;
        data.splice(index, 1, value.amount);
        return {
          label: formatSnakeCaseToTitleCase(value.detailed_category),
          data: data,
          backgroundColor: `white`,
        };
      });
    })
    .flat();
};

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ data }) => {
  const labels = Object.keys(data);
  const dataset = getDataset(data, Array.from({ length: labels.length }));
  console.log(dataset, "data");
  const chartData = {
    labels,
    datasets: dataset,
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: {

        display: false
      },
      title: {
        display: true,
        text: "Grouped Bar Chart",
        color: "white",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: "rgb(81, 90, 217)",
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        type: "logarithmic",
        grid: {
          display: true,
          color: "rgb(81, 90, 217)",
        },
        ticks: {
          color: "white",
        },
      },
    },
    elements: {
      bar: {
        barThickness: 10,
        maxBarThickness: 40,
      },
    },
  };

  return <Bar data={chartData as any} options={options} />;
};

export { GroupedBarChart };
