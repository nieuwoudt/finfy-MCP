import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";
import { config } from "@/config/env";
import * as Sentry from "@sentry/nextjs";
import { FingoalWebhookHandler } from "@/utils/mcp/fingoal-webhook";
import { WebhookMonitor, WebhookEventType, WebhookSource } from "@/utils/mcp/webhook-monitor";

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
      
      // Log the error in our monitoring system
      await WebhookMonitor.logEvent({
        source: WebhookSource.FINGOAL,
        event_type: WebhookEventType.FAILED,
        error_message: `Error storing batch request ID: ${error.message}`,
        batch_id: payload.batch_request_id
      });
      
      return false;
    }

    // Log successful enrichment completion
    await WebhookMonitor.logEvent({
      source: WebhookSource.FINGOAL,
      event_type: WebhookEventType.ENRICHMENT_COMPLETED,
      batch_id: payload.batch_request_id
    });

    // TODO: Fetch the enriched transactions from FinGoal
    // This could be done here or by a separate process
    return true;
  } catch (error) {
    console.error("Error handling enrichment webhook:", error);
    
    // Log the error in our monitoring system
    await WebhookMonitor.logEvent({
      source: WebhookSource.FINGOAL,
      event_type: WebhookEventType.FAILED,
      error_message: `Error handling enrichment webhook: ${error instanceof Error ? error.message : String(error)}`,
      batch_id: payload.batch_request_id
    });
    
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
      let userId = '';
      
      // Process created tags
      for (const tag of created) {
        userId = tag.user_id;
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
          
          // Log the error
          await WebhookMonitor.logEvent({
            source: WebhookSource.FINGOAL,
            event_type: WebhookEventType.FAILED,
            error_message: `Error storing user tag: ${error.message}`,
            user_id: tag.user_id
          });
        }
      }
      
      // Process deleted tags
      for (const tag of deleted) {
        userId = tag.user_id;
        const { error } = await supabase
          .from("fingoal_user_tags")
          .delete()
          .match({
            user_id: tag.user_id,
            tag: tag.tag,
          });

        if (error) {
          console.error("Error deleting user tag:", error);
          
          // Log the error
          await WebhookMonitor.logEvent({
            source: WebhookSource.FINGOAL,
            event_type: WebhookEventType.FAILED,
            error_message: `Error deleting user tag: ${error.message}`,
            user_id: tag.user_id
          });
        }
      }
      
      // Log successful user tags update
      if (userId) {
        await WebhookMonitor.logEvent({
          source: WebhookSource.FINGOAL,
          event_type: WebhookEventType.USER_TAGS_UPDATED,
          user_id: userId,
          payload_preview: `Created: ${created.length}, Deleted: ${deleted.length}`
        });
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
        
        // Log the error
        await WebhookMonitor.logEvent({
          source: WebhookSource.FINGOAL,
          event_type: WebhookEventType.FAILED,
          error_message: `Error storing tag update guid: ${error.message}`,
          batch_id: payload.guid
        });
      } else {
        // Log successful guid registration
        await WebhookMonitor.logEvent({
          source: WebhookSource.FINGOAL,
          event_type: WebhookEventType.RECEIVED,
          batch_id: payload.guid,
          payload_preview: `Tag update guid registered`
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error handling user tags webhook:", error);
    
    // Log the error
    await WebhookMonitor.logEvent({
      source: WebhookSource.FINGOAL,
      event_type: WebhookEventType.FAILED,
      error_message: `Error handling user tags webhook: ${error instanceof Error ? error.message : String(error)}`
    });
    
    return false;
  }
};

/**
 * Webhook POST handler
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let payloadPreview = '';
  
  try {
    // Get the raw body for signature verification
    const rawBody = await req.text();
    payloadPreview = rawBody.substring(0, 100); // Store a preview for logging
    
    // Log webhook received
    await WebhookMonitor.logEvent({
      source: WebhookSource.FINGOAL,
      event_type: WebhookEventType.RECEIVED,
      payload_preview: payloadPreview
    });
    
    // Get the signature from headers
    const signature = req.headers.get("x-fingoal-signature");
    if (!signature) {
      // Log signature missing error
      await WebhookMonitor.logEvent({
        source: WebhookSource.FINGOAL,
        event_type: WebhookEventType.INVALID_SIGNATURE,
        error_message: "Missing webhook signature",
        payload_preview: payloadPreview
      });
      
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 401 }
      );
    }

    // Verify signature
    if (!webhookHandler.verifySignature(rawBody, signature)) {
      // Log invalid signature error
      await WebhookMonitor.logEvent({
        source: WebhookSource.FINGOAL,
        event_type: WebhookEventType.INVALID_SIGNATURE,
        error_message: "Invalid webhook signature",
        payload_preview: payloadPreview
      });
      
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Parse the payload
    const payload = JSON.parse(rawBody);

    // Handle the webhook
    await webhookHandler.handleWebhook(payload);
    
    // Calculate processing time
    const processingTime = Date.now() - startTime;
    
    // Log successful webhook processing
    await WebhookMonitor.logEvent({
      source: WebhookSource.FINGOAL,
      event_type: WebhookEventType.PROCESSED,
      processing_time_ms: processingTime,
      payload_preview: payloadPreview,
      batch_id: payload.data?.batch_request_id || payload.guid
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    Sentry.captureException(error);
    
    // Calculate processing time even for errors
    const processingTime = Date.now() - startTime;
    
    // Log processing error
    await WebhookMonitor.logEvent({
      source: WebhookSource.FINGOAL,
      event_type: WebhookEventType.FAILED,
      error_message: `Error processing webhook: ${error instanceof Error ? error.message : String(error)}`,
      processing_time_ms: processingTime,
      payload_preview: payloadPreview
    });
    
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
} 