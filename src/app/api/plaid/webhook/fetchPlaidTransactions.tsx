import axios from "axios";
import { getAccessTokenByItemId } from "./supabaseClient";

export async function fetchPlaidTransactions(itemId: string) {
  try {
    const accessToken = await getAccessTokenByItemId(itemId);

    if (!accessToken) {
      throw new Error(`Access token not found for item_id: ${itemId}`);
    }

    const response = await axios.post(
      "https://production.plaid.com/transactions/get", //
      {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        access_token: accessToken,
        options: {
          count: 100,
          offset: 0,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const transactions = response.data.transactions;
    console.log("Fetched transactions:", transactions);
    return transactions;
  } catch (err) {
    console.error("Error fetching Plaid transactions:");
    throw err;
  }
}
