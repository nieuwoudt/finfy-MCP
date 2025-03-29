import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/nextjs";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Logging function for webhook events
async function logWebhookEvent(eventName: string, payload: any) {
  try {
    await supabase.from("webhook_logs").insert({
      provider: "yodlee",
      event_name: eventName,
      payload: payload,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error logging webhook event:", error);
    Sentry.captureException(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log the incoming webhook for debugging
    console.log("Yodlee Webhook received:", JSON.stringify(body, null, 2));
    
    // Extract event information
    const eventType = body.event?.info;
    
    if (!eventType) {
      return NextResponse.json(
        { message: "Invalid webhook payload: missing event info" },
        { status: 400 }
      );
    }
    
    // Log the webhook event
    await logWebhookEvent(eventType, body);
    
    // Handle different webhook event types
    if (eventType.startsWith("REFRESH")) {
      // Handle refresh events (REFRESH.PROCESS_COMPLETED, etc.)
      await handleRefreshEvent(body);
    } else if (eventType.startsWith("DATA_UPDATES")) {
      // Handle data update events
      await handleDataUpdateEvent(body);
    } else if (eventType.startsWith("AUTO_REFRESH_UPDATES")) {
      // Handle auto refresh update events
      await handleAutoRefreshEvent(body);
    } else if (eventType.startsWith("LATEST_BALANCE_UPDATES")) {
      // Handle balance update events
      await handleBalanceUpdateEvent(body);
    } else {
      console.warn("Unhandled webhook event type:", eventType);
    }
    
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error processing Yodlee webhook:", error);
    Sentry.captureException(error);
    
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 }
    );
  }
}

/**
 * Handle refresh events from Yodlee
 */
async function handleRefreshEvent(payload: any) {
  const eventInfo = payload.event.info;
  const data = payload.event.data;
  const providerAccountId = data?.providerAccountId;
  const userId = data?.userId;
  
  if (eventInfo === "REFRESH.PROCESS_COMPLETED") {
    // Update the refresh status in the database
    if (providerAccountId) {
      await supabase
        .from("provider_accounts")
        .update({
          last_refresh: new Date().toISOString(),
          refresh_status: "COMPLETED"
        })
        .eq("provider_account_id", providerAccountId);
    }
    
    // Trigger data processing if needed
    if (userId) {
      // This could be a background function to fetch and process the latest data
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/yodlee/process-latest-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, providerAccountId })
      }).catch(err => console.error("Error processing latest data:", err));
    }
  }
}

/**
 * Handle data update events from Yodlee
 */
async function handleDataUpdateEvent(payload: any) {
  const data = payload.event.data;
  const userId = data?.userId;
  
  if (userId) {
    // Log the data update event
    await supabase
      .from("data_update_events")
      .insert({
        user_id: userId,
        provider: "yodlee",
        event_data: data,
        created_at: new Date().toISOString()
      });
  }
}

/**
 * Handle auto refresh events from Yodlee
 */
async function handleAutoRefreshEvent(payload: any) {
  const data = payload.event.data;
  const providerAccountId = data?.providerAccountId;
  
  if (providerAccountId) {
    await supabase
      .from("provider_accounts")
      .update({
        auto_refresh_status: data?.status || "UNKNOWN",
        last_updated: new Date().toISOString()
      })
      .eq("provider_account_id", providerAccountId);
  }
}

/**
 * Handle balance update events from Yodlee
 */
async function handleBalanceUpdateEvent(payload: any) {
  const data = payload.event.data;
  const accountId = data?.accountId;
  
  if (accountId) {
    // You could trigger a process to fetch the latest balance
    // and update the account record in your database
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/yodlee/update-balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId })
    }).catch(err => console.error("Error updating balance:", err));
  }
} 