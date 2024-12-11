import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosExternal } from "@/utils/axios";
import { getErrorMessage, randomNumber } from "@/utils/helpers";
import { supabase } from "@/lib/supabase/client";
import * as Sentry from "@sentry/nextjs";
import { emojis } from "@/utils/variables";

interface ChatState {
  user_id: string;
  chat_id: string;
  history: string[];
  user_query: string;
  loading: boolean;
  loadingSendMessage: boolean;
  error: string | null;
  output: string | null;
  calculations: any | null;
  chats: any[];
  messages: any[];
  suggests: any;
  provider?: string;
  category?: string;
}

interface ChatResponse {
  data: any;
  error?: string;
}

const initialState: ChatState = {
  user_id: "",
  chat_id: "",
  history: [],
  user_query: "",
  loading: true,
  loadingSendMessage: false,
  error: null,
  output: null,
  calculations: null,
  chats: [],
  messages: [],
  suggests: null,
};

export const sendChatQuery = createAsyncThunk<
  ChatResponse | any,
  Partial<ChatState>
>(
  "chat/sendChatQuery",
  async ({ user_id, chat_id, history, user_query, provider, category }, { rejectWithValue }) => {
    try {
      const response = await axiosExternal.post(`/${category && category !== 'assistant' ? category : 'chat'}` as string, {
        user_id: user_id || "",
        chat_id: chat_id || "",
        history: history || [],
        user_query: user_query || "",
        provider: provider || "",
      });
      if (response.data.error) {
        return rejectWithValue(response.data.error || "Something went wrong");
      }
      return response.data;
    } catch (error: any) {
      Sentry.captureException(error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const createMessage = createAsyncThunk(
  "chat/createMessage",
  async (dataMessage: {
    chat_id: string;
    user_id: number;
    content: string;
    message_type: "user" | "bot";
    is_processed?: boolean;
    response_time?: string | null;
  }) => {
    const { data, error } = await supabase
      .from("messages")
      .insert([dataMessage])
      .select();
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return data[0];
  }
);

export const createChat = createAsyncThunk(
  "chat/createChat",
  async ({ userId, title, category }: any) => {
    const index = randomNumber(1, emojis.length);

    const { data, error } = await supabase
      .from("chats")
      .insert([{ user_id: userId, title: `${emojis[index]} ${title}`, category: category ? category : 'assistant' }])
      .select();
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return data.at(0);
  }
);

export const fetchChatsByUserId = createAsyncThunk(
  "chat/fetchChatsByUserId",
  async (userId: string) => {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return data;
  }
);

export const updateChat = createAsyncThunk(
  "chat/updateChat",
  async (
    { id, updateData }: { id: string; updateData: any },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .update(updateData)
        .eq("id", id)
        .select();
      if (error) {
        Sentry.captureException(error);
        throw error;
      }
      return data[0];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("chats").delete().eq("id", chatId);
      if (error) {
        Sentry.captureException(error);
        throw error;
      }
      return chatId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMessagesForChat = createAsyncThunk(
  "chat/fetchMessagesForChat",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId);
      if (error) {
        Sentry.captureException(error);
        throw error;
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      state.messages = [];
    },
    setChatId(state, action: PayloadAction<string>) {
      state.chat_id = action.payload;
    },
    setIsLoadingSendMessage(state, action: PayloadAction<boolean>) {
      state.loadingSendMessage = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSuggestQuestions(state, action: PayloadAction<any>) {
      state.suggests = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatQuery.pending, (state) => {
        state.error = null;
      })
      .addCase(sendChatQuery.fulfilled, (state, action) => {
        if (action.payload.output) {
          state.output = action.payload.output.text || action.payload.output;
          state.calculations = action.payload.calculations;
          state.suggests = action.payload?.suggested_questions || null;
          if (state.user_query) {
            state.history.push(state.user_query);
          }
        }
      })
      .addCase(sendChatQuery.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(createChat.pending, (state) => {
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.push(action.payload);
        state.chat_id = action.payload.id;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(fetchChatsByUserId.pending, (state) => {
        state.error = null;
      })
      .addCase(
        fetchChatsByUserId.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.chats = action.payload;
        }
      )
      .addCase(fetchChatsByUserId.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      })

      .addCase(updateChat.pending, (state) => {
        state.error = null;
      })
      .addCase(updateChat.fulfilled, (state, action) => {
        const index = state.chats.findIndex(
          (chat) => chat.id === action.payload.id
        );
        if (index !== -1) {
          state.chats[index] = action.payload;
        }
      })
      .addCase(updateChat.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      })

      .addCase(deleteChat.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action: PayloadAction<string>) => {
        state.chats = state.chats.filter((chat) => chat.id !== action.payload);
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      })

      .addCase(fetchMessagesForChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMessagesForChat.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.messages = action.payload;
          state.history = action.payload.map((message) => message.content);
        }
      )
      .addCase(fetchMessagesForChat.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(createMessage.fulfilled, (state, action: PayloadAction<any>) => {
        state.history.push(action.payload.content);
        state.messages.push(action.payload);
      });
  },
});

export const {
  setUserQuery,
  addToHistory,
  resetChat,
  setIsLoadingSendMessage,
  setIsLoading,
  setChatId,
  setSuggestQuestions,
} = chatSlice.actions;
export default chatSlice.reducer;
