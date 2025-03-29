import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/fingoal";
import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/nextjs";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-webhook-verification");
    
    // Verify the webhook signature
    if (!signature || !verifyWebhookSignature(body, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { message: "Invalid webhook signature" },
        { status: 401 }
      );
    }
    
    const payload = JSON.parse(body);
    
    // Handle different webhook types
    if (payload.batch_request_id) {
      // Enrichment complete webhook
      await handleEnrichmentComplete(payload.batch_request_id);
    } else if (payload.guid) {
      // User tag status webhook
      await handleUserTagStatus(payload.guid);
    } else if (payload.finsights) {
      // Savings recommendations webhook
      await handleSavingsRecommendations(payload.finsights);
    } else {
      console.warn("Unknown webhook payload", payload);
    }
    
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    Sentry.captureException(error);
    
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 }
    );
  }
}

/**
 * Handle enrichment complete webhook
 */
async function handleEnrichmentComplete(batchRequestId: string) {
  try {
    // Update batch status in database
    const { error } = await supabase
      .from("enrichment_batches")
      .update({
        status: "ready_for_processing",
        updated_at: new Date().toISOString(),
      })
      .eq("batch_id", batchRequestId);
    
    if (error) {
      throw error;
    }
    
    // Trigger processing of enriched data
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/fingoal/enriched-transactions/${batchRequestId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling enrichment complete webhook:", error);
    Sentry.captureException(error);
  }
}

/**
 * Handle user tag status webhook
 */
async function handleUserTagStatus(guid: string) {
  try {
    // Save the GUID to the database for processing
    const { error } = await supabase
      .from("fingoal_tag_updates")
      .insert({
        guid,
        status: "pending",
        created_at: new Date().toISOString(),
      });
    
    if (error) {
      throw error;
    }
    
    // Trigger fetching of user tags in the background
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/fingoal/user-tags-update/${guid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling user tag status webhook:", error);
    Sentry.captureException(error);
  }
}

/**
 * Handle savings recommendations webhook
 */
async function handleSavingsRecommendations(finsights: any[]) {
  try {
    if (!Array.isArray(finsights) || finsights.length === 0) {
      return;
    }
    
    // Format recommendations for database
    const recommendations = finsights.map((finsight) => ({
      finsight_id: finsight.finsight_id,
      unique_id: finsight.uniqueId,
      user_id: finsight.user_id,
      transaction_id: finsight.transaction_id,
      insight_cta_url: finsight.insight_ctaurl,
      finsight_image: finsight.finsight_image,
      insight_text: finsight.insight_text,
      recommendation: finsight.recommendation,
      amount_found: finsight.amountFound,
      category: finsight.category,
      finsight_date: finsight.finsightDate || new Date().toISOString(),
      created_at: new Date().toISOString(),
    }));
    
    // Save recommendations to database
    const { error } = await supabase
      .from("savings_recommendations")
      .upsert(recommendations, { onConflict: "finsight_id" });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error handling savings recommendations webhook:", error);
    Sentry.captureException(error);
  }
} 