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

const LineChartByDate = () => {
  const data = {
    labels: [
      "2024-01-10",
      "2024-01-15",
      "2024-01-19",
      "2024-02-27",
      "2024-03-01",
      "2024-03-15",
      "2024-03-20",
    ],
    datasets: [
      {
        label: "Spending Over Time",
        data: [300, 100, 75, 30, 420, 300, 150],
        borderColor: "#36A2EB",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Spending Over Time</h2>
      <Line data={data} />
    </div>
  );
};

export { LineChartByDate };
