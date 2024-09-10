// src/app/redux/slices/darkModeSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { localStorageKeys } from "@/utils/variables";
interface DarkModeState {
  darkMode: boolean;
}

const initialState: DarkModeState = {
  darkMode:
    typeof window !== "undefined" &&
    localStorage.getItem("darkMode") === "true",
};

export const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem(
        localStorageKeys.darkMode,
        state.darkMode.toString()
      );
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem(
        localStorageKeys.darkMode,
        state.darkMode.toString()
      );
    },
  },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
