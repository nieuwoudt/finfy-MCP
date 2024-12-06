import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/utils/helpers";
import { Account } from "@/types";
import * as Sentry from "@sentry/nextjs";

interface AccountsState {
  accounts: Account[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AccountsState = {
  accounts: [],
  status: "idle",
  error: null,
};

export const fetchAccounts = createAsyncThunk("accounts/fetchAll", async () => {
  const { data, error } = await supabase.from("accounts").select("*");
  Sentry.captureException(error);
  if (error) throw error;
  return data as Account[];
});

export const fetchAccountById = createAsyncThunk<Account, string>(
  "accounts/fetchById",
  async (id) => {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return data as Account;
  }
);

export const fetchAccountsByUserId = createAsyncThunk<Account[], { userId: string, prefix: string }>(
  "accounts/fetchAccountsByUserId",
  async ({ userId, prefix }) => {
    const { data, error } = await supabase
      .from("accounts" + prefix)
      .select("*")
      .eq("user_id", userId)
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return data as Account[];
  }
);

export const createAccount = createAsyncThunk<Account, Omit<Account, "id">>(
  "accounts/create",
  async (newAccount) => {
    const { data, error } = await supabase
      .from("accounts")
      .insert([newAccount])
      .single();
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return data as Account;
  }
);

export const updateAccount = createAsyncThunk<Account, Partial<Account>>(
  "accounts/update",
  async (updatedAccount) => {
    const { id, ...dataAccount } = updatedAccount;
    const { data, error } = await supabase
      .from("accounts")
      .update(dataAccount)
      .eq("id", id)
      .single();
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return data as Account;
  }
);

export const deleteAccount = createAsyncThunk<string, { accountId: string, prefix: string }>(
  "accounts/delete",
  async ({ accountId, prefix }) => {
    const { error: transactionError } = await supabase
      .from("transactions" + prefix)
      .delete()
      .eq("account_id", accountId);

    const { error } = await supabase
      .from("accounts" + prefix)
      .delete()
      .eq("account_id", accountId);

    if (transactionError) {
      Sentry.captureException(error);
      throw transactionError;
    }
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return accountId;
  }
);

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAccounts.fulfilled,
        (state, action: PayloadAction<Account[]>) => {
          state.status = "succeeded";
          state.accounts = action.payload;
        }
      )
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(fetchAccountsByUserId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAccountsByUserId.fulfilled,
        (state, action: PayloadAction<Account[]>) => {
          state.status = "succeeded";
          state.accounts = action.payload;
        }
      )
      .addCase(fetchAccountsByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(fetchAccountById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAccountById.fulfilled,
        (state, action: PayloadAction<Account>) => {
          state.status = "succeeded";
          const existingAccount = state.accounts.find(
            (a) => a.id === action.payload.id
          );
          if (!existingAccount) {
            state.accounts.push(action.payload);
          }
        }
      )
      .addCase(fetchAccountById.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(
        createAccount.fulfilled,
        (state, action: PayloadAction<Account>) => {
          state.accounts.push(action.payload);
        }
      )
      .addCase(createAccount.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(updateAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateAccount.fulfilled,
        (state, action: PayloadAction<Account>) => {
          state.status = "succeeded";
          const index = state.accounts.findIndex(
            (a) => a.id === action.payload.id
          );
          if (index !== -1) {
            state.accounts[index] = action.payload;
          }
        }
      )
      .addCase(updateAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(
        deleteAccount.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.accounts = state.accounts.filter(
            (account) => account.account_id !== action.payload
          );
        }
      )
      .addCase(deleteAccount.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      });
  },
});

export default accountSlice.reducer;
