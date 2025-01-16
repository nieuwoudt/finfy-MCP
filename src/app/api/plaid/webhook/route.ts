import { NextRequest, NextResponse } from "next/server";
import { saveTransactions } from "./supabaseClient";
import { deleteTransactions } from "./deleteTransactions";
import { fetchPlaidTransactions } from "./fetchPlaidTransactions";
import { getUserIdByAccountId } from "./getUserIdByAccountId";

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
              throw new Error("Account ID not found in transactions");
            }

            const userId = await getUserIdByAccountId(accountId);

            const { error } = await saveTransactions(transactions, userId);
            if (error) {
              console.error("Error saving transactions:", error);
            } else {
              console.log("Transactions saved successfully");
            }
          }
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
