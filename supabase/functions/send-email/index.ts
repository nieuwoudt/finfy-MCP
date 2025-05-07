// Supabase Edge Function to send email notifications
// This function uses a third-party email service to send emails

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const FROM_EMAIL = Deno.env.get("NOTIFICATION_FROM_EMAIL") || "alerts@finfy.ai";

interface EmailRequestBody {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

serve(async (req) => {
  try {
    // Parse the request body
    const { to, subject, html, text, from = FROM_EMAIL } = await req.json() as EmailRequestBody;

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: to, subject, and html are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if SendGrid API key is configured
    if (!SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not set");
      return new Response(
        JSON.stringify({
          error: "Email service is not configured",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send email using SendGrid API
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: subject,
          },
        ],
        from: { email: from },
        content: [
          {
            type: "text/html",
            value: html,
          },
          ...(text
            ? [
                {
                  type: "text/plain",
                  value: text,
                },
              ]
            : []),
        ],
      }),
    });

    // Handle SendGrid response
    if (response.status >= 200 && response.status < 300) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email sent successfully",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      const errorData = await response.text();
      console.error("SendGrid API error:", errorData);
      return new Response(
        JSON.stringify({
          error: "Failed to send email",
          details: errorData,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}); 