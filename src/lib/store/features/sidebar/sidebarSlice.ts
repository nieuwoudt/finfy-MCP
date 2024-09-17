import { createSlice } from "@reduxjs/toolkit";
// import { localStorageKeys } from "@/utils/variables";
interface SidebarState {
  open: boolean;
}

const initialState: SidebarState = {
  open: false,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.open = !state.open;
      // localStorage.setItem(localStorageKeys.sidebar, state.open.toString());
    },
    setSidebar: (state, action) => {
      state.open = action.payload;
      // localStorage.setItem(localStorageKeys.sidebar, state.open.toString());
    },
  },
});

export const { toggleSidebar, setSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
