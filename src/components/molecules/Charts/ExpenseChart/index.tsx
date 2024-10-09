import React from "react";
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

interface ExpenseChartProps {
  data: any;
}

interface Transaction {
  primary_category: string;
  amount: number;
}

const formatCategoryName = (name: string) => {
  return name
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const groupExpensesByCategory = (data: Record<string, Transaction[]>) => {
  const categories: Record<string, { date: string; amount: number }[]> = {};

  Object.entries(data).forEach(([date, transactions]) => {
    transactions.forEach(({ primary_category, amount }) => {
      if (!categories[primary_category]) {
        categories[primary_category] = [];
      }
      categories[primary_category].push({ date, amount });
    });
  });

  return categories;
};

const getUniqueDates = (data: Record<string, Transaction[]>) => {
  return Object.keys(data).sort();
};

const getCategoryData = (
  categoryExpenses: { date: string; amount: number }[],
  allDates: string[]
) => {
  const data = allDates.map((date) => {
    const found = categoryExpenses.find((expense) => expense.date === date);
    return found ? found.amount : 0;
  });

  return data;
};

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data: dataChart }) => {
  const categorizedExpenses = groupExpensesByCategory(dataChart);
  const allDates = getUniqueDates(dataChart);

  const datasets = Object.entries(categorizedExpenses).map(
    ([category, expenses]) => ({
      label: category,
      data: getCategoryData(expenses, allDates),
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 1)`,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    })
  );

  console.log(datasets, "allDates");
  const data: any = {
    labels: allDates,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      label: formatCategoryName(dataset.label),
      pointBorderWidth: 0,
      pointBackgroundColor: dataset.borderColor,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Expenses Over Time",
        color: "white",
      },
    },
    scales: {
      y: {
        grid: {
          display: true,
          color: "rgb(81, 90, 217)",
        },
        ticks: {
          color: "white",
        },
      },
      x: {
        grid: {
          display: false,
          color: "rgb(81, 90, 217)",
        },
        ticks: {
          color: "white",
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 3,
        backgroundColor: (context: any) => context.dataset.borderColor,
        borderWidth: 0,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export { ExpenseChart };
