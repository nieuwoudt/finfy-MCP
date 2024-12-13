"use client";

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { setCategory } from "@/lib/store/features/category/categorySlice";

export const useCategory = () => {
  const dispatch: AppDispatch = useDispatch();
  const category = useSelector((state: RootState) => state.category.category);

  const setCurrentCategory = useCallback(
    async (category: string | null) => {
      await dispatch(setCategory(category));
    },
    [dispatch]
  );

  return {
    category,
    setCategory: setCurrentCategory,
  };
};
