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
    },
    setSidebar: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
