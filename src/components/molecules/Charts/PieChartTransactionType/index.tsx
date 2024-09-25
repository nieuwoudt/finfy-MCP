import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartTransactionType = () => {
  const data = {
    labels: ["Bank Fees", "Entertainment", "General Services", "Income"],
    datasets: [
      {
        data: [420, 280, 375, 300], // Corresponding values
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div>
      <h2>Spending by Primary Category</h2>
      <Pie data={data} />
    </div>
  );
};

export { PieChartTransactionType };
