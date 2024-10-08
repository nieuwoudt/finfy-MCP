"use client";

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { addChart, deleteChart } from "@/lib/store/features/dynamicChart/dynamicChartSlice";

export const useDynamicChart = () => {
  const dispatch: AppDispatch = useDispatch();

  const dynamicChart = useSelector((state: RootState) => state.dynamicChart);

  const handleAddChart = useCallback(
    (chart: any) => {
      dispatch(addChart(chart));
    },
    [dispatch]
  );
  const handleDeleteChart = useCallback(
    (id: any) => {
      dispatch(deleteChart(id));
    },
    [dispatch]
  );

  return {
    addChart: handleAddChart,
    deleteChart: handleDeleteChart,
    charts: dynamicChart.chats,
  };
};
