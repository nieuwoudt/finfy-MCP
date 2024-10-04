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
      state.chats = { ...state.chats, ...action.payload };
    },
  },
});

export const { addChart } = dynamicChartSlice.actions;

export default dynamicChartSlice.reducer;
