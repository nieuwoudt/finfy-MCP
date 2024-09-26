"use client";

import { ChartVisualizeButton } from "@/components/molecules";

const mockData = [
  {
    text: "Visualise Institution",
  },
  {
    text: "Visualise Institution",
  },
  {
    text: "Visualise Institution",
  },
];

const ListChartVisualizeButton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-white text-2xl font-semibold">Chart</h3>
      <ul title="" className="w-full flex flex-col gap-4">
        {mockData.map((data, index) => {
          return (
            <li className="w-full" key={index}>
              <ChartVisualizeButton text={data.text} chart={[]} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export { ListChartVisualizeButton };
