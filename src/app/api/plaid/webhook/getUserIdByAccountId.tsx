import { supabase } from "./supabaseClient";

export async function getUserIdByAccountId(accountId: any) {
  const { data, error } = await supabase
    .from("accounts")
    .select("user_id")
    .eq("account_id", accountId)
    .single();

  if (error) {
    console.error("Error fetching user_id:", error);
    throw new Error("Failed to fetch user_id");
  }
  return data.user_id;
}
