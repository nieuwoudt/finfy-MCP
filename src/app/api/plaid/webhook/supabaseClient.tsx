import { createClient } from "@supabase/supabase-js";
import axios from "axios";

export const supabase = createClient(
  "https://bjavtuefglobpfbxvuau.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function saveTransactions(transactions: any[], userId: string) {
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
    personal_finance_category: JSON.stringify(transaction.personal_finance_category),
    personal_finance_category_icon_url: transaction.personal_finance_category_icon_url,
    transaction_code: transaction.transaction_code,
    transaction_id: transaction.transaction_id,
    transaction_type: transaction.transaction_type,
    unofficial_currency_code: transaction.unofficial_currency_code,
    website: transaction.website,
    user_id: `${userId}`,
  }));

  try {
    const { error } = await supabase
    .from("transactions")
    .upsert(formattedTransactions, { onConflict: "transaction_id" }); 
  
    if (error) {
      console.error("Error saving transactions:", error);
      return { error };
    }

    console.log("Transactions saved successfully");
    return { error: null };
  } catch (err) {
    console.error("Unexpected error saving transactions:", err);
    return { error: err };
  } finally {
    const apiPayload = {
      user_id: `${userId}`,
      provider: "plaid",
    };

    const apiResponse = await axios.post(
      "https://finify-ai-137495399237.us-central1.run.app/insert_data",
      apiPayload
    );
  }
}

export async function getAccessTokenByItemId(itemId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("plaid_access_token")
      .eq("item_id", itemId)
      .single();

    if (error) {
      console.error("Error fetching access token from Supabase:", error);
      return null;
    }

    return data?.plaid_access_token || null;
  } catch (err) {
    console.error("Unexpected error fetching access token:", err);
    return null;
  }
}