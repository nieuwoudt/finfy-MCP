"use client";

import { ChartVisualizeButton, DynamicChart } from "@/components/molecules";
import { formatSnakeCaseToTitleCase } from "@/utils/helpers";
import { FC } from "react";

interface ListChartVisualizeButton {
  data: [string, any][];
}

const ListChartVisualizeButton: FC<ListChartVisualizeButton> = ({ data }) => {
  console.log(data, "data");
  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-white text-2xl font-semibold">Chart</h3>
      <DynamicChart />
      <ul className="w-full flex flex-col gap-4">
        {data.map(([key, chart]) => {
          return (
            <ChartVisualizeButton
              key={key}
              id={key}
              text={formatSnakeCaseToTitleCase(key)}
              chart={chart}
            />
          );
        })}
      </ul>
    </div>
  );
};
export { ListChartVisualizeButton };
