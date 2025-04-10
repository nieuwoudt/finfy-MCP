import axios from "axios";
import { config } from "@/config/env";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "../helpers";
import { AccountYodlee } from "@/types";
import { getApiBaseUrl, getSiteUrl } from "../environment";
import { FinifyMcpServer } from "@/utils/mcp/server";
import { FinifyMcpClient } from "@/utils/mcp/client";

const getBaseURL = (isExternal: boolean): string => {
  if (isExternal) {
    return getApiBaseUrl('yodlee');
  } else {
    if (typeof window !== "undefined") {
      return `${window.location.origin}`;
    } else {
      return getSiteUrl();
    }
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
      transaction_id: transaction?.id || null,
      container: typeof transaction?.container === "string" ? transaction.container : null,
      amount: typeof transaction?.amount?.amount === "number" ? transaction.amount.amount : null,
      currency: typeof transaction?.amount?.currency === "string" ? transaction.amount.currency : null,
      category_type: typeof transaction?.categoryType === "string" ? transaction.categoryType : null,
      category_id: typeof transaction?.categoryId === "number" ? transaction.categoryId : null,
      category: typeof transaction?.category === "string" ? transaction.category : null,
      category_source: typeof transaction?.categorySource === "string" ? transaction.categorySource : null,
      high_level_category_id: typeof transaction?.highLevelCategoryId === "number" ? transaction.highLevelCategoryId : null,
      created_date: transaction?.createdDate ? new Date(transaction.createdDate).toISOString() : null,
      last_updated: transaction?.lastUpdated ? new Date(transaction.lastUpdated).toISOString() : null,
      description_original: typeof transaction?.description?.original === "string" ? transaction.description.original : null,
      is_manual: typeof transaction?.isManual === "boolean" ? transaction.isManual : null,
      source_type: typeof transaction?.sourceType === "string" ? transaction.sourceType : null,
      date: transaction?.date ? new Date(transaction.date).toISOString().split("T")[0] : null, // ISO format date
      transaction_date: transaction?.transactionDate
        ? new Date(transaction.transactionDate).toISOString().split("T")[0]
        : null, // ISO format date
      post_date: transaction?.postDate
        ? new Date(transaction.postDate).toISOString().split("T")[0]
        : null, // ISO format date
      status: typeof transaction?.status === "string" ? transaction.status : null,
      account_id: typeof transaction?.accountId === "number" ? transaction.accountId : null,
      running_balance_amount: typeof transaction?.runningBalance?.amount === "number" ? transaction.runningBalance.amount : null,
      running_balance_currency: typeof transaction?.runningBalance?.currency === "string" ? transaction.runningBalance.currency : null,
      check_number: typeof transaction?.checkNumber === "string" ? transaction.checkNumber : null,
      user_id: userId,
      description: typeof transaction?.description === "string" ? transaction.description : null,
    }));

    // Insert transactions into the database
    const { error: transactionError } = await supabase
      .from("transactions_yodlee")
      .insert(formattedTransactions);

    if (transactionError) {
      throw transactionError;
    }

    // Call the API to trigger ingestion
    const apiPayload = {
      user_id: `${userId}`,
      provider: "yodlee",
    };

    const apiResponse = await axios.post(
      "https://finify-ai-137495399237.us-central1.run.app/insert_data",
      apiPayload
    );

    if (apiResponse.data) {
      const { message, job_id } = apiResponse.data;

      // Save the job_id into the `transaction_status` table
      // const { error: statusError } = await supabase
      //   .from("transaction_status")
      //   .insert({
      //     job_id,
      //     user_id: userId,
      //     status: false, // Initial status set to false
      //   });

      // if (statusError) {
      //   throw statusError;
      // }

      // console.log(message);

      return { errorMessage: null };
    }
  } catch (error) {
    console.error("Error saving Yodlee transactions:", error);
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const saveAccountYodlee = async (
  accounts: AccountYodlee[],
  userId: string,
  provider: any
) => {
  try {
    const formattedAccounts = accounts.map((account) => {
      return {
        account_id: account?.id || null,
        container: typeof account?.CONTAINER === "string" ? account.CONTAINER : null,
        provider_account_id: account?.providerAccountId || null,
        account_name: typeof account?.accountName === "string" ? account.accountName : null,
        account_status: typeof account?.accountStatus === "string" ? account.accountStatus : null,
        account_number: typeof account?.accountNumber === "string" ? account.accountNumber : null,
        aggregation_source: typeof account?.aggregationSource === "string" ? account.aggregationSource : null,
        is_asset: typeof account?.isAsset === "boolean" ? account.isAsset : null,
        balance_amount: typeof account?.balance?.amount === "number" ? account.balance.amount : null,
        balance_currency: typeof account?.balance?.currency === "string" ? account.balance.currency : null,
        user_classification: typeof account?.userClassification === "string" ? account.userClassification : null,
        include_in_net_worth: typeof account?.includeInNetWorth === "boolean" ? account.includeInNetWorth : null,
        provider_id: typeof account?.providerId === "string" ? account.providerId : null,
        provider_name: typeof account?.providerName === "string" ? account.providerName : null,
        provider_logo: typeof provider.logo === "string" ? provider.logo : null,
        is_manual: typeof account?.isManual === "boolean" ? account.isManual : null,
        available_balance_amount: typeof account?.availableBalance?.amount === "number" ? account.availableBalance.amount : null,
        available_balance_currency: typeof account?.availableBalance?.currency === "string" ? account.availableBalance.currency : null,
        current_balance_amount: typeof account?.currentBalance?.amount === "number" ? account.currentBalance.amount : null,
        current_balance_currency: typeof account?.currentBalance?.currency === "string" ? account.currentBalance.currency : null,
        account_type: typeof account?.accountType === "string" ? account.accountType : null,
        displayed_name: typeof account?.displayedName === "string" ? account.displayedName : null,
        created_date: account?.createdDate ? new Date(account.createdDate).toISOString() : null,
        last_updated: account?.lastUpdated ? new Date(account.lastUpdated).toISOString() : null,
        bank_transfer_code_id: account?.bankTransferCode?.[0]?.id || null,
        bank_transfer_code_type: account?.bankTransferCode?.[0]?.type || null,
        full_account_number: typeof account?.fullAccountNumber === "string" ? account.fullAccountNumber : null,
        payment_account_number: account?.fullAccountNumberList?.paymentAccountNumber || null,
        user_id: userId,
      };
    });

    const { error } = await supabase
      .from("accounts_yodlee")
      .insert(formattedAccounts);

    if (error) {
      throw error;
    }

    return { errorMessage: null };
  } catch (error) {
    console.error("Error saving Yodlee accounts:", error);
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const axiosYodleeExternal = createAxiosInstance(true);
export const axiosYodleeInternal = createAxiosInstance(false);

async function testMcp() {
  // Start the server
  const server = new FinifyMcpServer();
  await server.initialize();
  console.log("MCP Server initialized");
  
  // Initialize the client (pointing to our server)
  const client = new FinifyMcpClient(
    "node", 
    ["./server-script.js"], // This would need to be the actual path to your server script
    process.env.ANTHROPIC_API_KEY || ""
  );
  await client.initialize();
  console.log("MCP Client initialized");
  
  // Test getting a context block for a known user ID
  try {
    const userId = "YOUR_TEST_USER_ID"; // Replace with an actual user ID from your database
    const contextBlock = await client.getContextBlock(userId);
    console.log("Context block successfully retrieved:");
    console.log(contextBlock.substring(0, 500) + "..."); // Print first 500 chars
  } catch (error) {
    console.error("Error getting context block:", error);
  }
  
  // Clean up
  await client.close();
  await server.close();
}

testMcp().catch(console.error);

async function testServer() {
  const server = new FinifyMcpServer();
  await server.initialize();
  
  // Manually test the get_context_block tool
  const result = await server.callToolDirectly("get_context_block", {
    user_id: "YOUR_TEST_USER_ID"
  });
  
  console.log("Tool result:", result);
  
  await server.close();
}

testServer().catch(console.error);
