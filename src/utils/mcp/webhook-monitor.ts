import { supabase } from "@/lib/supabase/client";
import * as Sentry from "@sentry/nextjs";

// Webhook event types
export enum WebhookEventType {
  RECEIVED = 'received',
  PROCESSED = 'processed',
  FAILED = 'failed',
  INVALID_SIGNATURE = 'invalid_signature',
  ENRICHMENT_COMPLETED = 'enrichment_completed',
  USER_TAGS_UPDATED = 'user_tags_updated'
}

// Webhook source types
export enum WebhookSource {
  FINGOAL = 'fingoal',
  YODLEE = 'yodlee',
  PLAID = 'plaid'
}

// Interface for webhook logging
interface WebhookLogEntry {
  source: WebhookSource;
  event_type: WebhookEventType;
  payload_preview?: string;
  status_code?: number;
  error_message?: string;
  batch_id?: string;
  user_id?: string;
  processing_time_ms?: number;
}

/**
 * Utility class for monitoring webhook activity
 */
export class WebhookMonitor {
  /**
   * Log a webhook event
   */
  static async logEvent(entry: WebhookLogEntry): Promise<void> {
    try {
      const { error } = await supabase
        .from('webhook_events')
        .insert({
          source: entry.source,
          event_type: entry.event_type,
          payload_preview: entry.payload_preview ? 
            // Truncate payload preview to avoid huge logs
            entry.payload_preview.substring(0, 255) : undefined,
          status_code: entry.status_code,
          error_message: entry.error_message,
          batch_id: entry.batch_id,
          user_id: entry.user_id,
          processing_time_ms: entry.processing_time_ms,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error("Error logging webhook event:", error);
        Sentry.captureException(error);
      }
    } catch (err) {
      console.error("Failed to log webhook event:", err);
      Sentry.captureException(err);
    }
  }

  /**
   * Get recent webhook events for monitoring
   */
  static async getRecentEvents(limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('webhook_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching webhook events:", error);
        Sentry.captureException(error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error("Failed to fetch webhook events:", err);
      Sentry.captureException(err);
      return [];
    }
  }

  /**
   * Calculate webhook processing statistics
   */
  static async getWebhookStats(source: WebhookSource, timeWindowHours: number = 24): Promise<any> {
    try {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() - timeWindowHours);
      
      const { data, error } = await supabase
        .from('webhook_events')
        .select('*')
        .eq('source', source)
        .gte('created_at', startTime.toISOString());

      if (error) {
        console.error("Error fetching webhook stats:", error);
        Sentry.captureException(error);
        return {
          total_received: 0,
          total_processed: 0,
          failed: 0,
          success_rate: 0,
          avg_processing_time_ms: 0
        };
      }

      const events = data || [];
      const received = events.filter(e => e.event_type === WebhookEventType.RECEIVED).length;
      const processed = events.filter(e => e.event_type === WebhookEventType.PROCESSED).length;
      const failed = events.filter(e => e.event_type === WebhookEventType.FAILED).length;
      const processingTimes = events
        .filter(e => e.processing_time_ms)
        .map(e => e.processing_time_ms);
      
      const avgProcessingTime = processingTimes.length > 0 ? 
        processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length : 0;
      
      const successRate = received > 0 ? 
        ((processed / received) * 100).toFixed(2) : 0;

      return {
        total_received: received,
        total_processed: processed,
        failed,
        success_rate: successRate,
        avg_processing_time_ms: avgProcessingTime
      };
    } catch (err) {
      console.error("Failed to calculate webhook stats:", err);
      Sentry.captureException(err);
      return {
        total_received: 0, 
        total_processed: 0,
        failed: 0,
        success_rate: 0,
        avg_processing_time_ms: 0
      };
    }
  }
} 