'use client';

import React, { FC } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

interface SpendingChartProps {
  data: any;
}

const SpendingChart: FC<SpendingChartProps> = ({ data: dataChart }) => {
  const chartType = dataChart.chart_type;
  const title = dataChart.name;
  const rawData = dataChart.data;

  const processData = () => {
    let labels: string[] = [];
    let amounts: number[] = [];

    if (chartType === 'bar' || chartType === 'pie') {
      if (typeof rawData === 'object' && !Array.isArray(rawData)) {
        labels = Object.keys(rawData);
        amounts = Object.values(rawData).map((value: any) => {
          if (typeof value === 'number') {
            return value;
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            return Object.values(value).reduce(
              (sum: number, item: any) => sum + (typeof item === 'number' ? item : 0), 0
            );
          } else if (Array.isArray(value)) {
            // Handling for arrays of items with detailed categories and amounts
            const amountByCategory: { [key: string]: number } = {};
            value.forEach((item) => {
              if (item.detailed_category && typeof item.amount === 'number') {
                const category = item.detailed_category;
                if (!amountByCategory[category]) {
                  amountByCategory[category] = 0;
                }
                amountByCategory[category] += item.amount;
              }
            });

            labels = Object.keys(amountByCategory);
            amounts = Object.values(amountByCategory);

            return 0;
          }
          return 0;
        });
      }
    } else if (chartType === 'line') {
      const groupedData = groupByMonth(rawData);
      labels = Object.keys(groupedData);
      amounts = Object.values(groupedData);
    }

    return { labels, amounts };
  };

  const groupByMonth = (data: { [key: string]: number }) => {
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

  const formatLabel = (label: string) => {
    return label
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const { labels, amounts } = processData();

  const barAndLineOptions: ChartOptions<"bar" | "line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: chartType !== 'pie',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let value = context.raw as number;
            // Adjust value formatting based on magnitude
            if (value < 1000) {
              return `$${value.toLocaleString()}`;
            } else {
              return `$${(value / 1000).toFixed(1)}k`;
            }
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
          callback: function (value: any) {
            return value < 1000 ? `$${value}` : `$${(value as number) / 1000}k`;
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
        },
      },
    },
  };

  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: true,
        labels: {
          generateLabels: (chart) => {
            const original = ChartJS.overrides.pie.plugins.legend.labels.generateLabels;
            const labelsOriginal = original.call(this, chart);
            const datasetColors = chart.data.datasets.flatMap((dataset) => dataset.backgroundColor);

            labelsOriginal.forEach((label: any) => {
              label.fillStyle = datasetColors[label.index];
            });

            return labelsOriginal;
          }
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let value = context.raw as number;
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: amounts,
        backgroundColor: chartType === 'pie' ? ["#0EA5E9", "#515AD9", "#6870DA", "#9CA3AF", "#374061"] : "#515AD9",
        borderColor: "rgb(81, 90, 217)",
        hoverBackgroundColor: "#6870DA",
        borderWidth: 1,
        borderRadius: chartType === 'bar' ? 4 : undefined,
      },
    ],
  };

  const renderChart = () => {
    if (chartType === 'bar') {
      return <Bar data={chartData} options={barAndLineOptions} />;
    } else if (chartType === 'line') {
      return <Line data={chartData} options={barAndLineOptions} />;
    } else if (chartType === 'pie') {
      return <Pie data={chartData} options={pieOptions} />;
    }
    return null;
  };

  return (
    <div className="bg-[#272E48] rounded-lg">
      {renderChart()}
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-white mb-4">
          {title}
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
                <span>{formatLabel(label)}</span>
                <span>${amounts[index].toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  
};

export { SpendingChart };
