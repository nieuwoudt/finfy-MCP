import { createSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  const body = await req.json();
  const data = body;
  const { error: updateError } = await supabase.auth.updateUser(data);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Повертаємо успішний результат
  return NextResponse.json({ message: "User data updated successfully" });
}
