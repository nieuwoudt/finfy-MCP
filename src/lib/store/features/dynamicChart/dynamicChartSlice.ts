import { createSlice } from "@reduxjs/toolkit";
import { localStorageKeys } from "@/utils/variables";
interface DynamicChartState {
  chats: any;
}

const initialState: DynamicChartState = {
  chats: {},
};

export const dynamicChartSlice = createSlice({
  name: "dynamicChart",
  initialState,
  reducers: {
    addChart: (state, action) => {
      state.chats = { ...action.payload };
    },
    deleteChart: (state, action) => {
      const chartId = action.payload;
      if (chartId && state.chats[chartId]) {
        const { [chartId]: _, ...rest } = state.chats;
        state.chats = rest;
      }
    },
  },
});

export const { addChart, deleteChart } = dynamicChartSlice.actions;

export default dynamicChartSlice.reducer;
