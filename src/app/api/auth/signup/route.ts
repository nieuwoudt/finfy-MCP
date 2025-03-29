import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send welcome email
    const msg = {
      to: email,
      from: "info@finfy.ai",
      subject: "Welcome to Finfy!",
      text: "Thank you for signing up with Finfy. We're excited to have you on board!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Welcome to Finfy!</h1>
          <p>Thank you for signing up with Finfy. We're excited to have you on board!</p>
          <p>Please check your email to confirm your account. You'll receive a confirmation email shortly.</p>
          <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
            <p style="margin: 0;">If you have any questions, feel free to reach out to our support team.</p>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error in signup:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 