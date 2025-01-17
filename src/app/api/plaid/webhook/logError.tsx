import { supabase } from "./supabaseClient";

export async function logError(context: string, requestData: any, errorMessage: string) {
  const { error } = await supabase.from("webhook_errors").insert([
    {
      context,
      request_data: requestData,
      error_message: errorMessage,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error logging to database:", error);
  }
}
