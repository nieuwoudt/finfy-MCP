import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase/client";
import { axiosInternal, axiosExternal } from "@/utils/axios";
import { getErrorMessage } from "@/utils/helpers";
import { User } from "@/types";

type Status = "idle" | "loading" | "succeeded" | "failed";
interface UsersState {
  user: User | null;
  status: Status;
  statusUpdate: Status;
  error: string | null;
}

type InsertDataUser = {
  message: string;
};

const initialState: UsersState = {
  user: null,
  status: "idle",
  statusUpdate: "idle",
  error: null,
};

export const setDataUser = createAsyncThunk<InsertDataUser, string>(
  "insert_data/setDataUser",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await axiosExternal.post("/insert_data", {
        user_id: user_id || "",
      });
      if (response.data.error) {
        return rejectWithValue(response.data.error || "Something went wrong");
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchUserByEmailOrPhone = createAsyncThunk<User>(
  "users/fetchUserByEmailOrPhone",
  async () => {
    const response = await axiosInternal.get("/api/get-user");
    const email = response?.data?.email;
    const phone = response?.data?.phone;
    if (email || phone) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq(email ? "email" : "phone", email || `+${phone}`)
        .single();
      if (error) throw error;
      return data!;
    }
    return null;
  }
);

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
    const { id, ...dataUser } = updatedUser;
    const { error } = await supabase
      .from("users")
      .update(dataUser)
      .eq("id", id)
      .single();
    if (error) throw error;
    return dataUser as User;
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
      .addCase(fetchUserByEmailOrPhone.pending, (state) => {})
      .addCase(
        fetchUserByEmailOrPhone.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
        }
      )
      .addCase(fetchUserByEmailOrPhone.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(updateUser.pending, (state) => {
        state.statusUpdate = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.statusUpdate = "succeeded";
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.statusUpdate = "failed";
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
