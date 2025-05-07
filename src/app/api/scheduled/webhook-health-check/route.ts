import { NextResponse } from 'next/server';
import { WebhookSource } from '@/utils/mcp/webhook-monitor';
import { WebhookAlerts } from '@/utils/mcp/webhook-alerts';
import * as Sentry from '@sentry/nextjs';

// This route is called by a scheduled task (e.g., CRON job) to regularly check webhook health
export async function GET(request: Request) {
  try {
    // Check for secret API key to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.WEBHOOK_HEALTH_CHECK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run health checks for all webhook sources
    const results = await Promise.all([
      checkSourceHealth(WebhookSource.FINGOAL),
      checkSourceHealth(WebhookSource.YODLEE),
      checkSourceHealth(WebhookSource.PLAID),
    ]);

    // Process any pending notifications
    await WebhookAlerts.sendAlertNotifications();

    return NextResponse.json({
      success: true,
      message: 'Webhook health checks completed',
      results,
    });
  } catch (error) {
    console.error('Error in webhook health check:', error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function checkSourceHealth(source: WebhookSource): Promise<any> {
  try {
    // Define custom thresholds for each source if needed
    const thresholds = {
      [WebhookSource.FINGOAL]: { failureRate: 15, consecutiveFailures: 3, responseTime: 5000 },
      [WebhookSource.YODLEE]: { failureRate: 20, consecutiveFailures: 5, responseTime: 8000 },
      [WebhookSource.PLAID]: { failureRate: 10, consecutiveFailures: 2, responseTime: 3000 },
    };

    // Check health for this source
    const isHealthy = await WebhookAlerts.checkWebhookHealth(
      source,
      thresholds[source]
    );

    return {
      source,
      isHealthy,
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error checking health for ${source}:`, error);
    Sentry.captureException(error);
    return {
      source,
      isHealthy: false,
      error: 'Error checking webhook health',
      checkedAt: new Date().toISOString(),
    };
  }
} 