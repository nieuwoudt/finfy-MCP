import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface PieChartTransactionTypeProps {
  data: { [transactionType: string]: number };
}

const PieChartTransactionType: React.FC<PieChartTransactionTypeProps> = ({
  data,
}) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Spending by Transaction Type",
        data: Object.values(data),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Spending Per Transaction Type (Pie Chart)",
      },
      legend: {
        position: "right",
      },
    },
  };

  return (
    <div>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export { PieChartTransactionType };
