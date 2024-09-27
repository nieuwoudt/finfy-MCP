"use client";

import React, { FC, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DynamicChartProps {
  dataOptions: any;
}

const DynamicChart: FC<DynamicChartProps> = ({ dataOptions }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const handleAddDataset = (datasetKey: string, datasetValues: any) => {
    const newLabels = Array.isArray(datasetValues)
      ? Object.keys(datasetValues)
      : [datasetKey];

    const newDataset = {
      label: datasetKey.replace(/_/g, " ").toUpperCase(),
      data: Array.isArray(datasetValues)
        ? Object.values(datasetValues)
        : [datasetValues],
      borderColor: getRandomColor(),
      fill: false,
    };
    setChartData((prevState: any) => ({
      labels: [...Array.from(new Set([...prevState.labels, ...newLabels]))],
      datasets: [...prevState.datasets, newDataset],
    }));
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      <h2>Dynamic Spending Chart</h2>
      <Line data={chartData} />

      <div>
        {dataOptions.map(([key, values]: any) => (
          <button key={key} onClick={() => handleAddDataset(key, values)}>
            {key.replace(/_/g, " ").toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export { DynamicChart };
