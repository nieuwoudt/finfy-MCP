"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/utils/helpers";
import { Account, Transaction } from "@/types";

export const createAccountAction = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { auth } = createSupabaseClient();
    const { error } = await auth.signUp({ password, email });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const loginAction = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { auth } = createSupabaseClient();
    const { error } = await auth.signInWithPassword({ password, email });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const signOutAction = async () => {
  try {
    const { auth } = createSupabaseClient();
    const { error } = await auth.signOut();
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const signInWithOtp = async (phone: string) => {
  try {
    const { auth } = supabase;
    const { error } = await auth.signInWithOtp({
      phone: `+${phone}`,
    });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const verifyPhoneUser = async (phone: string, token: string) => {
  try {
    const { auth } = createSupabaseClient();
    const { error } = await auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const resendCodeOTP = async (phone: string) => {
  try {
    const { auth } = createSupabaseClient();
    const { error } = await auth.resend({
      phone,
      type: "sms",
    });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const saveTransactionsAndAccounts = async (
  transactions: Transaction[],
  userId: string
) => {
  try {
    const uniqueAccounts = transactions.reduce(
      (acc: Account[], transaction) => {
        if (
          !acc.some((account) => account.account_id === transaction.account_id)
        ) {
          const account: Account = {
            account_id: transaction.account_id,
            account_owner: transaction.account_owner,
            iso_currency_code: transaction.iso_currency_code,
            balance: 0,
            status: "active",
            type: "default",
            user_id: `${userId}`,
          };
          acc.push(account);
        }
        return acc;
      },
      []
    );

    const { error: accountError } = await supabase
      .from("accounts")
      .insert(uniqueAccounts);

    if (accountError) {
      throw accountError;
    }

    const formattedTransactions = transactions.map((transaction) => ({
      account_id: transaction.account_id,
      amount: transaction.amount,
      authorized_date: transaction.authorized_date,
      authorized_datetime: transaction.authorized_datetime,
      category: transaction.category,
      category_id: transaction.category_id,
      check_number: transaction.check_number,
      counterparties: JSON.stringify(transaction.counterparties),
      date: transaction.date,
      datetime: transaction.datetime,
      iso_currency_code: transaction.iso_currency_code,
      location: JSON.stringify(transaction.location),
      logo_url: transaction.logo_url,
      merchant_entity_id: transaction.merchant_entity_id,
      merchant_name: transaction.merchant_name,
      name: transaction.name,
      payment_channel: transaction.payment_channel,
      payment_meta: JSON.stringify(transaction.payment_meta),
      pending: transaction.pending,
      pending_transaction_id: transaction.pending_transaction_id,
      personal_finance_category: JSON.stringify(
        transaction.personal_finance_category
      ),
      personal_finance_category_icon_url:
        transaction.personal_finance_category_icon_url,
      transaction_code: transaction.transaction_code,
      transaction_id: transaction.transaction_id,
      transaction_type: transaction.transaction_type,
      unofficial_currency_code: transaction.unofficial_currency_code,
      website: transaction.website,
      user_id: `${userId}`,
    }));

    const { error: transactionError } = await supabase
      .from("transactions")
      .insert(formattedTransactions);

    if (transactionError) {
      throw transactionError;
    }

    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const saveBalances = async (accountData: any, userId: string) => {
  try {
    const { error } = await supabase.from("balances").insert(
      accountData.map((account: any) => ({
        account_id: account.account_id,
        persistent_account_id: account.persistent_account_id,
        name: account.name,
        official_name: account.official_name,
        mask: account.mask,
        subtype: account.subtype,
        type: account.type,
        available_balance: account.balances.available,
        current_balance: account.balances.current,
        iso_currency_code: account.balances.iso_currency_code,
        unofficial_currency_code: account.balances.unofficial_currency_code,
        created_at: new Date().toISOString(),
        user_id: userId,
      }))
    );

    if (error) {
      throw error;
    }

    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};
