import { supabase } from "@/lib/supabase/client";
import { FingoalClient } from "./fingoal-integration";
import { getErrorMessage } from "@/utils/helpers";

interface FingoalWebhookPayload {
  type: string;
  data: {
    transaction_id: string;
    user_id: string;
    batch_request_id?: string;  // For batch completion webhooks
    enrichment: {
      tags: string[];
      insights: string[];
      categories: string[];
      merchant: string;
      confidence: number;
      // Additional enriched data fields that may be in data-rich webhooks
      amount?: number;
      date?: string;
      description?: string;
      additional_metadata?: Record<string, any>;
    };
  };
}

export class FingoalWebhookHandler {
  private fingoalClient: FingoalClient;

  constructor(clientId: string, clientSecret: string, isProduction: boolean = false) {
    this.fingoalClient = new FingoalClient(clientId, clientSecret, isProduction);
  }

  /**
   * Handle incoming webhook from Fingoal
   */
  async handleWebhook(payload: FingoalWebhookPayload): Promise<void> {
    try {
      // Verify webhook signature
      const signature = process.env.FINGOAL_WEBHOOK_SIGNATURE;
      if (!signature) {
        throw new Error("Fingoal webhook signature not configured");
      }

      // Process data-rich webhook with enriched transaction data
      if (payload.data && payload.data.enrichment) {
        // Store enrichment data in database
        const { error } = await supabase
          .from("transaction_enrichment")
          .upsert({
            transaction_id: payload.data.transaction_id,
            user_id: payload.data.user_id,
            tags: payload.data.enrichment.tags,
            insights: payload.data.enrichment.insights,
            categories: payload.data.enrichment.categories,
            merchant: payload.data.enrichment.merchant,
            confidence: payload.data.enrichment.confidence,
            // Store additional data if available in data-rich webhook
            amount: payload.data.enrichment.amount,
            date: payload.data.enrichment.date,
            description: payload.data.enrichment.description,
            additional_metadata: payload.data.enrichment.additional_metadata,
            updated_at: new Date().toISOString()
          });

        if (error) {
          throw error;
        }

        // If this is a new transaction, trigger user tag sync
        if (payload.type === "transaction.enriched") {
          await this.fingoalClient.syncUserTags(payload.data.user_id);
        }
      }
      // Handle batch completion webhooks (no need to fetch enriched data)
      else if (payload.data && payload.data.batch_request_id) {
        // Log batch completion
        console.log(`Batch ${payload.data.batch_request_id} completed`);
        
        // Store batch completion in database
        const { error } = await supabase
          .from("fingoal_batches")
          .insert({
            batch_request_id: payload.data.batch_request_id,
            status: "completed",
            processed_at: new Date().toISOString(),
          });

        if (error) {
          console.error("Error storing batch completion:", error);
        }
      }
    } catch (error) {
      console.error("Error processing Fingoal webhook:", error);
      throw new Error(`Failed to process webhook: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload: string, signature: string): boolean {
    return this.fingoalClient.verifyWebhookSignature(payload, signature);
  }
} 