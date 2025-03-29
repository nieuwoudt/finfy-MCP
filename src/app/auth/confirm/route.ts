import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (!token_hash || !type) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/authentication?error=Invalid confirmation link`
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Verify the token
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "signup",
    });

    if (error) {
      console.error("Error verifying token:", error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/authentication?error=${error.message}`
      );
    }

    // If successful, redirect to onboarding
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
    );
  } catch (error) {
    console.error("Error in confirm route:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/authentication?error=An unexpected error occurred`
    );
  }
}
