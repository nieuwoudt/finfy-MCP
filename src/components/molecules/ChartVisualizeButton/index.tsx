"use client";

import { Button, Icon } from "@/components/atoms";
import { useDynamicChart } from "@/hooks";
import { FC } from "react";

interface ChartVisualizeButtonProps {
  id: string;
  text: string;
  chart: any;
  onClick: () => void;
}

const ChartVisualizeButton: FC<ChartVisualizeButtonProps> = ({
  id,
  text,
  chart,
  onClick,
}) => {
  const { addChart, charts } = useDynamicChart();

  return (
    <li className="w-full">
      <Button
        onClick={onClick}
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
