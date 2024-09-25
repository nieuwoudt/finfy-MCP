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

interface BarChartPrimarySecondaryProps {
  data: { [primaryCategory: string]: { [secondaryCategory: string]: number } };
}

const BarChartPrimarySecondary: React.FC<BarChartPrimarySecondaryProps> = ({
  data,
}) => {
  const labels: string[] = [];
  const values: number[] = [];
  const colors: string[] = [];

  Object.keys(data).forEach((primaryCategory) => {
    Object.keys(data[primaryCategory]).forEach((secondaryCategory) => {
      labels.push(`${primaryCategory} - ${secondaryCategory}`);
      values.push(data[primaryCategory][secondaryCategory]);
      colors.push(
        `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        }, 0.6)`
      ); // Random color
    });
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Amount ($)",
        data: values,
        backgroundColor: colors,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Spending by Primary and Secondary Category",
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

export { BarChartPrimarySecondary };
