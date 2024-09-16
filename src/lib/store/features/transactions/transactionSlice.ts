import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/utils/helpers";
import { Transaction } from "@/types";

interface TransactionsState {
  transactions: Transaction[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  status: "idle",
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async () => {
    const { data, error } = await supabase.from("transactions").select("*");
    if (error) throw error;
    return data as Transaction[];
  }
);

export const fetchTransactionById = createAsyncThunk<Transaction, string>(
  "transactions/fetchById",
  async (id) => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("transaction_id", id)
      .single();
    if (error) throw error;
    return data as Transaction;
  }
);

export const createTransaction = createAsyncThunk<
  Transaction,
  Omit<Transaction, "id">
>("transactions/create", async (newTransaction) => {
  const { data, error } = await supabase
    .from("transactions")
    .insert([newTransaction])
    .single();
  if (error) throw error;
  return data as Transaction;
});

export const updateTransaction = createAsyncThunk<
  Transaction,
  Partial<Transaction>
>("transactions/update", async (updatedTransaction) => {
  const { transaction_id, ...dataTransaction } = updatedTransaction;
  const { data, error } = await supabase
    .from("transactions")
    .update(dataTransaction)
    .eq("transaction_id", transaction_id)
    .single();
  if (error) throw error;
  return data as Transaction;
});

export const deleteTransaction = createAsyncThunk<string, string>(
  "transactions/delete",
  async (transactionId) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("transaction_id", transactionId);
    if (error) throw error;
    return transactionId;
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.status = "succeeded";
          state.transactions = action.payload;
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(fetchTransactionById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchTransactionById.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.status = "succeeded";
          const existingTransaction = state.transactions.find(
            (t) => t.transaction_id === action.payload.transaction_id
          );
          if (!existingTransaction) {
            state.transactions.push(action.payload);
          }
        }
      )
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(
        createTransaction.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.transactions.push(action.payload);
        }
      )
      .addCase(createTransaction.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(updateTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateTransaction.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.status = "succeeded";
          const index = state.transactions.findIndex(
            (t) => t.transaction_id === action.payload.transaction_id
          );
          if (index !== -1) {
            state.transactions[index] = action.payload;
          }
        }
      )
      .addCase(updateTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error) || null;
      })
      .addCase(
        deleteTransaction.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.transactions = state.transactions.filter(
            (transaction) => transaction.transaction_id !== action.payload
          );
        }
      )
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.error = getErrorMessage(action.error) || null;
      });
  },
});

export default transactionSlice.reducer;
