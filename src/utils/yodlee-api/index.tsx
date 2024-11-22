import axios from "axios";
import { config } from "@/config/env";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "../helpers";
import { AccountYodlee } from "@/types";

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
      loginName: "a8aadd0d-75f6-4a35-939b-ec4465656e74_ADMIN" as string, //live_dev
      // loginName: "dcd2c5dc-a36a-46e5-845b-c6ce2ed646ac_ADMIN" as string, //sun_dev
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
      category_type: transaction.categoryType,
      category_id: transaction.categoryId,
      category: transaction.category,
      category_source: transaction.categorySource,
      high_level_category_id: transaction.highLevelCategoryId,
      created_date: transaction.createdDate,
      last_updated: transaction.lastUpdated,
      description_original: transaction.description.original,
      is_manual: transaction.isManual,
      source_type: transaction.sourceType,
      date: transaction.date,
      transaction_date: transaction.transactionDate,
      post_date: transaction.postDate,
      status: transaction.status,
      account_id: transaction.accountId,
      running_balance_amount: transaction.runningBalance.amount,
      running_balance_currency: transaction.runningBalance.currency,
      check_number: transaction.checkNumber,
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

export const saveAccountYodlee = async (
  accounts: AccountYodlee[],
  userId: string
) => {
  try {
    const formattedAccounts = accounts.map((account) => ({
      account_id: account.id,
      container: account.CONTAINER,
      provider_account_id: account.providerAccountId,
      account_name: account.accountName,
      account_status: account.accountStatus,
      account_number: account.accountNumber,
      aggregation_source: account.aggregationSource,
      is_asset: account.isAsset,
      balance_amount: account.balance.amount,
      balance_currency: account.balance.currency,
      user_classification: account.userClassification,
      include_in_net_worth: account.includeInNetWorth,
      provider_id: account.providerId,
      provider_name: account.providerName,
      is_manual: account.isManual,
      available_balance_amount: account.availableBalance?.amount,
      available_balance_currency: account.availableBalance?.currency,
      current_balance_amount: account.currentBalance.amount,
      current_balance_currency: account.currentBalance.currency,
      account_type: account.accountType,
      displayed_name: account.displayedName,
      created_date: account.createdDate,
      last_updated: account.lastUpdated,
      bank_transfer_code_id: account.bankTransferCode[0]?.id,
      bank_transfer_code_type: account.bankTransferCode[0]?.type,
      full_account_number: account.fullAccountNumber,
      payment_account_number:
        account.fullAccountNumberList.paymentAccountNumber,
      user_id: `${userId}`,
    }));
    const { error } = await supabase
      .from("accounts_yodlee")
      .insert(formattedAccounts);
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

export const axiosYodleeExternal = createAxiosInstance(true);
export const axiosYodleeInternal = createAxiosInstance(false);
