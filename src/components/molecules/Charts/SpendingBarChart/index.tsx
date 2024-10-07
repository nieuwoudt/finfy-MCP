import React, { FC } from "react";
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

export const groupByMonth = (data: { [key: string]: number }) => {
  const groupedData: { [key: string]: number } = {};

  Object.keys(data).forEach((date) => {
    const month = new Date(date).toLocaleString("en-US", {
      month: "short",
      year: "2-digit",
    });

    if (groupedData[month]) {
      groupedData[month] += data[date];
    } else {
      groupedData[month] = data[date];
    }
  });

  return groupedData;
};
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SpendingBarChartProps {
  data: any;
}

const SpendingBarChart: FC<SpendingBarChartProps> = ({ data: dataChart }) => {
  const groupedData = groupByMonth(dataChart);
  const labels = Object.keys(groupedData);
  const amounts = Object.values(groupedData);

  const data = {
    labels,
    datasets: [
      {
        label: "Spending by Date",
        data: amounts,
        backgroundColor: "#515AD9",
        borderColor: "rgb(81, 90, 217)",
        hoverBackgroundColor: "#6870DA",
        borderWidth: 1,
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        display: false, 
      },
      title: {
        display: true,
        text: "Monthly Spending",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#D1D5DB",
          maxRotation: 0, 
          minRotation: 0,
        },
        grid: {
          display: true,
          color: "#D1D5DB",
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#D1D5DB",
        },
      },
    },
  };

  return (
    <>
      <Bar data={data} options={options} />
      <ul>
        {labels.map((month, index) => (
          <li
            key={month}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "10px 0",
            }}
          >
            <span>{month}</span>
            <span>${amounts[index].toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export { SpendingBarChart };
