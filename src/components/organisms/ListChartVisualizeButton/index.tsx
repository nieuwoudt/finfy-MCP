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
      <ul title="" className="w-full flex flex-col gap-4">
        <DynamicChart dataOptions={data as any} />
        {data.map(([key, chart]) => {
          return (
            <li className="w-full" key={key}>
              <ChartVisualizeButton
                text={formatSnakeCaseToTitleCase(key)}
                chart={chart}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export { ListChartVisualizeButton };
