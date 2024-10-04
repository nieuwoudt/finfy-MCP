"use client";

import { Button, Icon } from "@/components/atoms";
import { useDynamicChart } from "@/hooks";
import { FC } from "react";

interface ChartVisualizeButtonProps {
  id: string;
  text: string;
  chart: any;
}

const ChartVisualizeButton: FC<ChartVisualizeButtonProps> = ({
  id,
  text,
  chart,
}) => {
  const { addChart, charts } = useDynamicChart();
  if (charts[id]) {
    return null;
  }
  return (
    <li className="w-full">
      <Button
        onClick={() => addChart({ [id]: chart })}
        full
        className="chart-button-border px-3 py-4 !rounded-lg text-base text-white justify-between bg-purple-15 bg-opacity-10"
        variant="ghost"
      >
        {text}
        <Icon type="PlusCircle" className="w-5 h-5 stroke-purple-15" />
      </Button>
    </li>
  );
};

export { ChartVisualizeButton };
