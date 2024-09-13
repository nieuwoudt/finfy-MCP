import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase/client";
import axios from "axios";
import { AppStore } from "../..";
import { getErrorMessage } from "@/utils/helpers";
import { User } from "@/types";

interface UsersState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  user: null,
  status: "idle",
  error: null,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await axios.get("/api/get-user");
  return response.data;
});

export const fetchUserById = createAsyncThunk<User, number>(
  "users/fetchUser",
  async (id) => {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", id)
      .single();
    if (error) throw error;
    return data!;
  }
);

export const createUser = createAsyncThunk<User, Pick<User, "email">>(
  "users/createUser",
  async (newUser) => {
    const { data, error } = await supabase
      .from("users")
      .insert([newUser])
      .single();
    if (error) throw error;
    return data!;
  }
);

export const updateUser = createAsyncThunk<User, Partial<User>>(
  "users/updateUser",
  async (updatedUser) => {
    const { email, ...dataUser } = updatedUser;
    const { data, error } = await supabase
      .from("users")
      .update(dataUser)
      .eq("email", email)
      .single();
    if (error) throw error;
    return data!;
  }
);

export const deleteUser = createAsyncThunk<number, number>(
  "users/deleteUser",
  async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);
    if (error) throw error;
    return userId;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      });
  },
});

export default userSlice.reducer;
