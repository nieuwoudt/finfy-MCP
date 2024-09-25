import { Doughnut } from "react-chartjs-2";

const BarChartPrimarySecondary = () => {
  const data = {
    labels: [
      "Bank Fees - Other Bank Fees",
      "Entertainment - Casinos & Gambling",
      "Entertainment - Sporting Events",
      "Entertainment - TV & Movies",
      "General Services - Insurance",
      "General Services - Security",
      "Income - Other Income",
    ],
    datasets: [
      {
        data: [420, 100, 30, 150, 75, 300, 300],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#F7464A",
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Spending by Primary and Secondary Category</h2>
      <Doughnut data={data} />
    </div>
  );
};

export { BarChartPrimarySecondary };
