"use client";

import { FC, useState } from "react";
import { ChartVisualizeButton } from "@/components/molecules";
import { formatSnakeCaseToTitleCase } from "@/utils/helpers";
import { DynamicChart } from "@/components/molecules";
import { useDynamicChart } from "@/hooks";

interface ListChartVisualizeButtonProps {
  data: [string, any][];
  handleOpenModal: any
}

const ListChartVisualizeButton: FC<ListChartVisualizeButtonProps> = ({ data, handleOpenModal }) => {

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-white text-2xl font-semibold">Chart</h3>
      <ul className="w-full flex flex-col gap-4">
        {data.map(([key, chart]) => (
          <ChartVisualizeButton
            key={key}
            id={key}
            text={formatSnakeCaseToTitleCase(key)}
            chart={chart}
            onClick={() => handleOpenModal(key, chart)}
          />
        ))}
      </ul>
    </div>
  );
};

export { ListChartVisualizeButton };
