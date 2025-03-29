import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (!token_hash || !type) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Verify the token and update the user's email confirmation status
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "signup" | "invite" | "recovery",
    });

    if (error) {
      console.error("Error confirming email:", error);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Redirect to onboarding after successful confirmation
    return NextResponse.redirect(new URL("/onboarding", req.url));
  } catch (error: any) {
    console.error("Error in email confirmation:", error);
    return NextResponse.json({ error: "Failed to confirm email" }, { status: 500 });
  }
} 