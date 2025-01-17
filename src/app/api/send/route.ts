import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sgMail.send({
      to,
      from: "info@finfy.ai",
      subject,
      html,
    });

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error sending email:", error.response?.body || error.message);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json({ allowedMethods: ["POST"] }, { status: 200 });
}
