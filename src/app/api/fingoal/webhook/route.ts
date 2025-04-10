import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";
import { config } from "@/config/env";
import * as Sentry from "@sentry/nextjs";
import { FingoalWebhookHandler } from "@/utils/mcp/fingoal-webhook";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const clientId = process.env.FINGOAL_CLIENT_ID;
const clientSecret = process.env.FINGOAL_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Fingoal credentials not configured");
}

const webhookHandler = new FingoalWebhookHandler(
  clientId,
  clientSecret,
  process.env.NODE_ENV === "production"
);

/**
 * Verify webhook signature using HMAC
 */
const verifyWebhookSignature = (signature: string, payload: string): boolean => {
  try {
    const secret = config.FINGOAL_CLIENT_SECRET || "";
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(payload).digest("hex");
    
    return digest === signature;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
};

/**
 * Handle enrichment webhook - called when a batch of transactions has been enriched
 */
const handleEnrichmentWebhook = async (payload: { batch_request_id: string }) => {
  try {
    // Store the batch request ID in Supabase or your preferred database
    const { error } = await supabase
      .from("fingoal_batches")
      .insert({
        batch_request_id: payload.batch_request_id,
        status: "completed",
        processed_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error storing batch request ID:", error);
      return false;
    }

    // TODO: Fetch the enriched transactions from FinGoal
    // This could be done here or by a separate process
    return true;
  } catch (error) {
    console.error("Error handling enrichment webhook:", error);
    return false;
  }
};

/**
 * Handle savings recommendation webhook - called when new savings recommendations are available
 * NOTE: Temporarily disabled as per FinGoal's recommendation to wait for their updated version
 */
// const handleSavingsWebhook = async (payload: any) => {
//   try {
//     const finsights = payload.finsights || [];
    
//     // Store each savings recommendation in Supabase
//     for (const finsight of finsights) {
//       const { error } = await supabase
//         .from("fingoal_savings_recommendations")
//         .insert({
//           finsight_id: finsight.finsight_id,
//           user_id: finsight.user_id,
//           transaction_id: finsight.transaction_id,
//           category: finsight.category,
//           recommendation: finsight.recommendation,
//           insight_text: finsight.insight_text,
//           amount_found: finsight.amountFound,
//           insight_url: finsight.insight_ctaurl,
//           image_url: finsight.finsight_image,
//           created_at: new Date().toISOString(),
//         });

//       if (error) {
//         console.error("Error storing savings recommendation:", error);
//       }
//     }
    
//     return true;
//   } catch (error) {
//     console.error("Error handling savings webhook:", error);
//     return false;
//   }
// };

/**
 * Handle user tags webhook - called when user tags have been updated
 */
const handleUserTagsWebhook = async (payload: { userTags?: { created: any[], deleted: any[] }, guid?: string }) => {
  try {
    if (payload.userTags) {
      // Direct userTags webhook
      const { created = [], deleted = [] } = payload.userTags;
      
      // Process created tags
      for (const tag of created) {
        const { error } = await supabase
          .from("fingoal_user_tags")
          .insert({
            user_id: tag.user_id,
            tag: tag.tag,
            confidence: tag.confidence,
            created_at: new Date().toISOString(),
          });

        if (error) {
          console.error("Error storing user tag:", error);
        }
      }
      
      // Process deleted tags
      for (const tag of deleted) {
        const { error } = await supabase
          .from("fingoal_user_tags")
          .delete()
          .match({
            user_id: tag.user_id,
            tag: tag.tag,
          });

        if (error) {
          console.error("Error deleting user tag:", error);
        }
      }
    } else if (payload.guid) {
      // Tag status webhook with guid
      const { error } = await supabase
        .from("fingoal_tag_updates")
        .insert({
          guid: payload.guid,
          status: "pending",
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Error storing tag update guid:", error);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error handling user tags webhook:", error);
    return false;
  }
};

/**
 * Webhook POST handler
 */
export async function POST(req: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await req.text();
    
    // Get the signature from headers
    const signature = req.headers.get("x-fingoal-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 401 }
      );
    }

    // Verify signature
    if (!webhookHandler.verifySignature(rawBody, signature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Parse the payload
    const payload = JSON.parse(rawBody);

    // Handle the webhook
    await webhookHandler.handleWebhook(payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
} 