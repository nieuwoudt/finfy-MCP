import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://bjavtuefglobpfbxvuau.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function deleteTransactions(transactionIds: string[]) {
  try {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .in("transaction_id", transactionIds);

    if (error) {
      console.error("Error deleting transactions:", error);
      return { error };
    }

    console.log("Transactions deleted:", transactionIds);
    return { error: null };
  } catch (err) {
    console.error("Unexpected error deleting transactions:", err);
    return { error: err };
  }
}
