"use client";

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { addChart } from "@/lib/store/features/dynamicChart/dynamicChartSlice";

export const useDynamicChart = () => {
  const dispatch: AppDispatch = useDispatch();

  const dynamicChart = useSelector((state: RootState) => state.dynamicChart);

  const handleAddChart = useCallback(
    (chart: any) => {
      dispatch(addChart(chart));
    },
    [dispatch]
  );

  return {
    addChart: handleAddChart,
    charts: dynamicChart.chats,
  };
};
