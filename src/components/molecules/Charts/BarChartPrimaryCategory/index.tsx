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
} from "chart.js";
import { ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartPrimaryCategoryProps {
  data: { [key: string]: number };
}

const BarChartPrimaryCategory: React.FC<BarChartPrimaryCategoryProps> = ({
  data,
}) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Amount ($)",
        data: Object.values(data),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Spending by Primary Category",
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export { BarChartPrimaryCategory };
