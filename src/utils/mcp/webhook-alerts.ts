import { supabase } from "@/lib/supabase/client";
import * as Sentry from "@sentry/nextjs";
import { WebhookSource } from "./webhook-monitor";

interface WebhookAlert {
  id: string;
  source: WebhookSource;
  event_type: string;
  error_message: string;
  status_code?: number;
  created_at: string;
  resolved: boolean;
  notified: boolean;
  severity: 'low' | 'medium' | 'high';
}

interface AlertThresholds {
  failureRate: number;
  consecutiveFailures: number;
  responseTime: number;
}

/**
 * Webhook Alerts System for monitoring and notifying about webhook failures
 */
export class WebhookAlerts {
  // Default thresholds for alerts
  static defaultThresholds: AlertThresholds = {
    failureRate: 20, // Alert if failure rate is above 20%
    consecutiveFailures: 3, // Alert if 3 consecutive failures
    responseTime: 5000, // Alert if response time is above 5000ms
  };

  /**
   * Create a new alert for a webhook failure
   */
  static async createAlert(
    source: WebhookSource,
    eventType: string,
    errorMessage: string,
    statusCode?: number,
    severity: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<string | null> {
    try {
      // Check if a similar unresolved alert already exists
      const { data: existingAlerts } = await supabase
        .from('webhook_alerts')
        .select('*')
        .eq('source', source)
        .eq('event_type', eventType)
        .eq('resolved', false)
        .limit(1);

      // If a similar alert exists, don't create a new one
      if (existingAlerts && existingAlerts.length > 0) {
        return existingAlerts[0].id;
      }

      // Create a new alert
      const { data, error } = await supabase
        .from('webhook_alerts')
        .insert({
          source,
          event_type: eventType,
          error_message: errorMessage,
          status_code: statusCode,
          created_at: new Date().toISOString(),
          resolved: false,
          notified: false,
          severity
        })
        .select();

      if (error) {
        throw error;
      }

      return data?.[0]?.id || null;
    } catch (err) {
      console.error("Failed to create webhook alert:", err);
      Sentry.captureException(err);
      return null;
    }
  }

  /**
   * Mark an alert as resolved
   */
  static async resolveAlert(alertId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('webhook_alerts')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', alertId);

      if (error) {
        throw error;
      }

      return true;
    } catch (err) {
      console.error("Failed to resolve webhook alert:", err);
      Sentry.captureException(err);
      return false;
    }
  }

  /**
   * Get active (unresolved) alerts
   */
  static async getActiveAlerts(): Promise<WebhookAlert[]> {
    try {
      const { data, error } = await supabase
        .from('webhook_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      console.error("Failed to get active webhook alerts:", err);
      Sentry.captureException(err);
      return [];
    }
  }

  /**
   * Send alert notifications for webhook failures
   */
  static async sendAlertNotifications(): Promise<boolean> {
    try {
      // Get alerts that haven't been notified yet
      const { data: alerts, error } = await supabase
        .from('webhook_alerts')
        .select('*')
        .eq('notified', false)
        .eq('resolved', false)
        .order('severity', { ascending: false });

      if (error) {
        throw error;
      }

      if (!alerts || alerts.length === 0) {
        return true; // No alerts to send
      }

      for (const alert of alerts) {
        // Send notification (email, Slack, etc.)
        await this.sendNotification(alert);

        // Mark as notified
        await supabase
          .from('webhook_alerts')
          .update({ notified: true })
          .eq('id', alert.id);
      }

      return true;
    } catch (err) {
      console.error("Failed to send webhook alert notifications:", err);
      Sentry.captureException(err);
      return false;
    }
  }

  /**
   * Check for webhook health issues based on statistics
   */
  static async checkWebhookHealth(
    source: WebhookSource,
    customThresholds?: Partial<AlertThresholds>
  ): Promise<boolean> {
    try {
      const thresholds = { ...this.defaultThresholds, ...customThresholds };

      // Get webhook stats for the source
      const { data, error } = await supabase
        .rpc('get_webhook_stats', { 
          source_param: source,
          hours_param: 6 // Check last 6 hours
        });

      if (error) {
        throw error;
      }

      if (!data) {
        return true; // No data to check
      }

      // Check failure rate
      const successRate = parseFloat(data.success_rate);
      const failureRate = 100 - successRate;

      if (failureRate > thresholds.failureRate) {
        // Create an alert for high failure rate
        await this.createAlert(
          source,
          'high_failure_rate',
          `Webhook failure rate of ${failureRate.toFixed(2)}% exceeds threshold of ${thresholds.failureRate}%`,
          undefined,
          failureRate > 50 ? 'high' : 'medium'
        );
        return false;
      }

      // Check for consecutive failures
      const { data: recentEvents, error: eventsError } = await supabase
        .from('webhook_events')
        .select('*')
        .eq('source', source)
        .order('created_at', { ascending: false })
        .limit(thresholds.consecutiveFailures + 2);

      if (eventsError) {
        throw eventsError;
      }

      if (recentEvents) {
        let consecutiveFailures = 0;
        for (const event of recentEvents) {
          if (event.event_type === 'failed') {
            consecutiveFailures++;
          } else {
            break; // Break on first non-failure
          }
        }

        if (consecutiveFailures >= thresholds.consecutiveFailures) {
          // Create an alert for consecutive failures
          await this.createAlert(
            source,
            'consecutive_failures',
            `${consecutiveFailures} consecutive webhook failures detected`,
            undefined,
            'high'
          );
          return false;
        }
      }

      // Everything looks good
      return true;
    } catch (err) {
      console.error("Failed to check webhook health:", err);
      Sentry.captureException(err);
      return false;
    }
  }

  /**
   * Helper method to send notifications through various channels
   * This can be extended to support different notification methods
   */
  private static async sendNotification(alert: WebhookAlert): Promise<void> {
    // Send email notification
    if (process.env.NEXT_PUBLIC_ENABLE_EMAIL_ALERTS === 'true') {
      try {
        await fetch('/api/notifications/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: `Webhook Alert: ${alert.severity.toUpperCase()} - ${alert.source}`,
            message: `
              <h1>Webhook Failure Alert</h1>
              <p><strong>Source:</strong> ${alert.source}</p>
              <p><strong>Event Type:</strong> ${alert.event_type}</p>
              <p><strong>Error:</strong> ${alert.error_message}</p>
              <p><strong>Status Code:</strong> ${alert.status_code || 'N/A'}</p>
              <p><strong>Time:</strong> ${new Date(alert.created_at).toLocaleString()}</p>
              <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/webhooks">View Webhook Dashboard</a></p>
            `
          }),
        });
      } catch (err) {
        console.error("Failed to send email notification:", err);
        Sentry.captureException(err);
      }
    }

    // Send Slack notification
    if (process.env.NEXT_PUBLIC_ENABLE_SLACK_ALERTS === 'true') {
      try {
        await fetch('/api/notifications/slack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channel: process.env.SLACK_WEBHOOK_ALERTS_CHANNEL || 'webhook-alerts',
            text: `*Webhook Failure Alert (${alert.severity.toUpperCase()})*\n*Source:* ${alert.source}\n*Error:* ${alert.error_message}\n*Time:* ${new Date(alert.created_at).toLocaleString()}`,
          }),
        });
      } catch (err) {
        console.error("Failed to send Slack notification:", err);
        Sentry.captureException(err);
      }
    }
  }
}

// Schema for webhook_alerts table
/*
CREATE TABLE IF NOT EXISTS webhook_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  status_code INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notified BOOLEAN DEFAULT FALSE,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')) DEFAULT 'medium'
);
*/ 