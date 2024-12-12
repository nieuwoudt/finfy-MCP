import { createSlice } from "@reduxjs/toolkit";

interface CategoryState {
  category: string | null;
}

const initialState: CategoryState = {
    category: null
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});

export const { setCategory } = categorySlice.actions;

export default categorySlice.reducer;
