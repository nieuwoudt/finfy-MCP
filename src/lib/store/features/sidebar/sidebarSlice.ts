import { createSlice } from "@reduxjs/toolkit";
import { cookiesKeys } from "@/utils/variables";
import { setCookie, getCookie } from "cookies-next";
interface SidebarState {
  open: boolean;
}

const isDesktop = () => typeof window !== "undefined" && window.innerWidth >= 1024;


const initialState: SidebarState = {
  // On desktop, expand the sidebar. On mobile, use cookie or default collapsed.
  open: isDesktop() 
    ? true 
    : (getCookie(cookiesKeys.sidebar) as any) === "true",
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.open = !state.open;
      setCookie(cookiesKeys.sidebar, state.open);
    },
    setSidebar: (state, action) => {
      state.open = action.payload;
      setCookie(cookiesKeys.sidebar, state.open);
    },
  },
});

export const { toggleSidebar, setSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
