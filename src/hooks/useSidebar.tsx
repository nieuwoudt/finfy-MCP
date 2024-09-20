"use client";

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  setSidebar,
  toggleSidebar,
} from "@/lib/store/features/sidebar/sidebarSlice";

export const useSidebar = () => {
  const dispatch: AppDispatch = useDispatch();
  const open = useSelector((state: RootState) => state.sidebar.open);

  const handleClose = useCallback(() => {
    dispatch(setSidebar(false));
  }, [dispatch]);

  const handleOpen = useCallback(() => {
    dispatch(setSidebar(true));
  }, [dispatch]);

  const handleToggle = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  return {
    open,
    handleClose,
    handleOpen,
    handleToggle,
  };
};
