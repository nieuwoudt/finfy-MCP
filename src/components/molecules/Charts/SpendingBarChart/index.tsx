'use client';

import React, { FC, useState } from "react";
import { Bar } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const processData = (data: any) => {
  const groupedData: { [key: string]: number } = {};

  if (typeof data === 'number') {
    groupedData['Total'] = data;
  } else if (Array.isArray(data)) {
    data.forEach((item: any) => {
      if (Array.isArray(item) && item.length === 2) {
        const [key, value] = item;

        if (typeof value === 'number') {
          groupedData[formatLabel(key)] = value;
        } else if (typeof value === 'object' && value !== null) {
          groupedData[formatLabel(key)] = Object.values(value).reduce(
            (sum: number, val: any) => sum + (typeof val === 'number' ? val : 0),
            0
          );
        }
      }
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.entries(data).forEach(([key, value]: any) => {
      if (typeof value === 'number') {
        groupedData[formatLabel(key)] = value;
      } else if (typeof value === 'object' && value !== null) {
        if (value?.[0]?.hasOwnProperty('amount') && typeof value?.[0].amount === 'number') {
          console.log(value?.[0], "valuevalue4");
          groupedData[formatLabel(key)] = value?.[0].amount;
        } else {
          groupedData[formatLabel(key)] = Object.values(value).reduce(
            (sum: number, val: any) => sum + (typeof val === 'number' ? val : 0),
            0
          );
        }
      }
    });
  }


  return groupedData;
};

const formatLabel = (label: string) => {
  return label
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
};

export const groupByMonth = (data: { [key: string]: number }) => {
  const groupedData: { [key: string]: number } = {};

  Object.keys(data).forEach((key) => {
    const parsedDate = new Date(key);
    if (!isNaN(parsedDate.getTime())) {
      const month = parsedDate.toLocaleString("en-US", {
        month: "short",
        year: "2-digit",
      });

      if (groupedData[month]) {
        groupedData[month] += data[key];
      } else {
        groupedData[month] = data[key];
      }
    } else {
      groupedData[formatLabel(key)] = data[key];
    }
  });

  return groupedData;
};

interface SpendingBarChartProps {
  data: any;
}

const SpendingBarChart: FC<SpendingBarChartProps> = ({ data: dataChart }) => {
  const processedData = processData(dataChart);


  const groupedData = groupByMonth(processedData);
  const labels = Object.keys(groupedData);
  const amounts = Object.values(groupedData);

  const isDateBased = labels.every(label => !isNaN(new Date(label).getTime()));
  const chartTitle = isDateBased ? "Monthly Breakdown" : "Breakdown";

  const data = {
    labels,
    datasets: [
      {
        label: "Spending Breakdown",
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

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let value = context.raw as number;
            return `$${value.toLocaleString()}`;
          },
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: (amounts.reduce((a, b) => a + b, 0) / amounts.length),
            yMax: (amounts.reduce((a, b) => a + b, 0) / amounts.length),
            borderColor: 'rgba(81, 90, 217, 0.9)',
            borderWidth: 2,
            borderDash: [10, 5],
            label: {
              content: 'Average',
              position: 'start',
              backgroundColor: 'rgba(81, 90, 217, 0.9)',
              color: '#FFF',
            },
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#D1D5DB",
          callback: function (value) {
            return `$${(value as number) / 1000}k`;
          },
        },
        grid: {
          color: "#374061",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#D1D5DB",
          maxRotation: 0,
          callback: function (value, index, ticks) {
            return labels[index];
          },
        },
      },
    },
  };

  function formatDateToMonthYear(dateString: string): string {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString("en-US", {
        month: "long",
      });
    }
    return formatLabel(dateString);
  }

  return (
    <div className="bg-[#272E48] rounded-lg">
      <Bar data={data} options={options} />

      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-white mb-4">
          {chartTitle}
        </h3>
        <div
          className="overflow-y-auto max-h-[300px] custom-scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#6B7280 #2D3748",
          }}
        >
          <ul className="text-white">
            {labels.map((label, index) => (
              <li
                key={label}
                className="flex justify-between py-6 px-[18px] h-14 border-b border-[#374061]"
              >
                <span>{formatDateToMonthYear(label)}</span>
                <span>${amounts[index].toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { SpendingBarChart };
