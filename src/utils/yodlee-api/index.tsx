import axios from "axios";
import { config } from "@/config/env";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "../helpers";

const getBaseURL = (isExternal: boolean): string => {
  if (typeof window !== "undefined") {
    if (isExternal) {
      return config.YOADLEE_API as string;
    } else {
      return `${window.location.origin}`;
    }
  }

  if (isExternal) {
    return config.YOADLEE_API as string;
  } else {
    return config.BASE_URL as string;
  }
};

const createAxiosInstance = (isExternal: boolean) => {
  return axios.create({
    baseURL: getBaseURL(isExternal),
    headers: {
      "Api-Version": config.YODLEE_API_VERSION || "1.1",
      "Content-Type": "application/x-www-form-urlencoded",
      loginName: "sbMemk6s4a3914f7601" as string,
    },
  });
};

export const saveTransactionsYodlee = async (
  transactions: any[],
  userId: string
) => {
  try {
    const formattedTransactions = transactions.map((transaction) => ({
      transaction_id: transaction.id,
      container: transaction.container,
      amount: transaction.amount.amount,
      currency: transaction.amount.currency,
      category_type: transaction.category_type,
      category_id: transaction.category_id,
      category: transaction.category,
      category_source: transaction.category_source,
      high_level_category_id: transaction.high_level_category_id,
      created_date: transaction.created_date,
      last_updated: transaction.last_updated,
      description_original: transaction.description_original,
      is_manual: transaction.is_manual,
      source_type: transaction.source_type,
      date: transaction.date,
      transaction_date: transaction.transaction_date,
      post_date: transaction.post_date,
      status: transaction.status,
      account_id: transaction.account_id,
      running_balance_amount: transaction.running_balance_amount,
      running_balance_currency: transaction.running_balance_currency,
      check_number: transaction.check_number,
      user_id: `${userId}`,
    }));

    const { error: transactionError } = await supabase
      .from("transactions_yodlee")
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

export const axiosYodleeExternal = createAxiosInstance(true);
export const axiosYodleeInternal = createAxiosInstance(false);
