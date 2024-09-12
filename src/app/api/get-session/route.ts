import { createSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const { auth } = createSupabaseClient();

  return Response.json(auth);
}
