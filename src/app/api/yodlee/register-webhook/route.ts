import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, callbackUrl, eventName } = await req.json();
    
    if (!accessToken || !callbackUrl || !eventName) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Valid event names from Yodlee documentation
    const validEvents = [
      "REFRESH",
      "DATA_UPDATES",
      "AUTO_REFRESH_UPDATES",
      "LATEST_BALANCE_UPDATES"
    ];
    
    if (!validEvents.includes(eventName)) {
      return NextResponse.json(
        { message: `Invalid event name. Must be one of: ${validEvents.join(", ")}` },
        { status: 400 }
      );
    }
    
    // Register the webhook with Yodlee
    const response = await fetch(`${process.env.YODLEE_BASE_URL}/configs/notifications/events/${eventName}`, {
      method: "POST",
      headers: {
        "Api-Version": process.env.YODLEE_API_VERSION || "1.1",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        event: {
          callbackUrl: callbackUrl
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to register webhook: ${JSON.stringify(errorData)}`);
    }
    
    return NextResponse.json({
      message: `Successfully registered webhook for ${eventName}`,
      success: true
    });
  } catch (error) {
    console.error("Error registering Yodlee webhook:", error);
    Sentry.captureException(error);
    
    return NextResponse.json(
      { message: "Error registering webhook", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 