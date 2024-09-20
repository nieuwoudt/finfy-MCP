import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { config } from "@/config/env";

interface ChatState {
  user_id: string;
  chat_id: string;
  history: string[];
  user_query: string;
  loading: boolean;
  error: string | null;
  output: string | null;
  calculations: any | null;
}

const initialState: ChatState = {
  user_id: "",
  chat_id: "",
  history: [],
  user_query: "",
  loading: false,
  error: null,
  output: null,
  calculations: null,
};

export const sendChatQuery = createAsyncThunk(
  "chat/sendChatQuery",
  async (
    { user_id, chat_id, history, user_query }: Partial<ChatState>,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(config.CHAT_API as string, {
        user_id: user_id || "",
        chat_id: chat_id || "",
        history: history || [],
        user_query: user_query || "",
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUserQuery(state, action: PayloadAction<string>) {
      state.user_query = action.payload;
    },
    addToHistory(state, action: PayloadAction<string>) {
      state.history.push(action.payload);
    },
    resetChat(state) {
      state.history = [];
      state.chat_id = "";
      state.output = null;
      state.calculations = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.output = action.payload.output.text;
        state.calculations = action.payload.calculations;
        if (state.user_query) {
          state.history.push(state.user_query);
        }
      })
      .addCase(sendChatQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUserQuery, addToHistory, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
