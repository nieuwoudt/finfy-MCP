import { NextRequest, NextResponse } from "next/server";
import { saveTransactions } from "./supabaseClient";
import { deleteTransactions } from "./deleteTransactions";
import { fetchPlaidTransactions } from "./fetchPlaidTransactions";
import { getUserIdByAccountId } from "./getUserIdByAccountId";
import { logError } from "./logError";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.webhook_type === "TRANSACTIONS") {
      switch (body.webhook_code) {
        case "TRANSACTIONS_REMOVED":
          const removedTransactionIds = body.removed_transactions || [];
          if (removedTransactionIds.length > 0) {
            const { error } = await deleteTransactions(removedTransactionIds);
            if (error) {
              await logError("TRANSACTIONS_REMOVED", body, JSON.stringify(error));
              console.error("Error removing transactions:", error);
            } else {
              console.log("Transactions removed successfully");
            }
          }
          break;

        default:
          const { item_id, new_transactions } = body;
          if (new_transactions > 0) {
            const transactions = await fetchPlaidTransactions(item_id);

            const accountId = transactions?.[0]?.account_id;
            if (!accountId) {
              const error = new Error("Account ID not found in transactions");
              await logError("FETCH_TRANSACTIONS", body, error.message);
              throw error;
            }

            const userId = await getUserIdByAccountId(accountId);

            const { error } = await saveTransactions(transactions, userId);
            if (error) {
              await logError("SAVE_TRANSACTIONS", body, JSON.stringify(error));
              console.error("Error saving transactions:", error);
            } else {
              console.log("Transactions saved successfully");
            }
          }
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: any) {
    await logError("WEBHOOK_PROCESSING", await req.json(), error?.message || error);
    console.error("Error processing webhook:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
