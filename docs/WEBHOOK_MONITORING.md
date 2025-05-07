# Finfy Webhook Monitoring System

## Overview
The Webhook Monitoring System tracks and debugs webhook events from external services such as FinGoal and Yodlee. It provides comprehensive insights into webhook performance, error rates, and processing details to help ensure the reliability of data integration with these services.

## Features
- **Webhook Event Logging**: All incoming webhook events are logged with source, type, payload, and processing status
- **Performance Metrics**: Track processing times to identify bottlenecks
- **Error Tracking**: Detailed error logging to diagnose issues quickly
- **Admin Dashboard**: Visual interface for monitoring webhook activity
- **Batch Scheduling**: Scheduled batch processing for FinGoal transaction enrichment
- **Alerting System**: Automated alerts when webhook performance degrades
- **Notification System**: Email and Slack notifications for critical issues

## Configuration
The webhook monitoring system is configured with the following components:

- **Database tables**: 
  - `webhook_events`: Records all webhook activity
  - `enrichment_batches`: Tracks scheduled and processed batches
  - `webhook_alerts`: Stores alert data for monitoring system health
  - `notification_logs`: Tracks all sent notifications

- **Edge Functions**:
  - `fingoal-webhook`: Processes webhooks from FinGoal
  - `yodlee-webhook`: Processes webhooks from Yodlee
  - `webhook-dashboard`: Provides dashboard data for the admin interface
  - `schedule-batch`: Handles scheduling of batch processing
  - `send-email`: Sends email notifications for webhook alerts

- **API Routes**:
  - `/api/notifications/email`: Endpoint for sending email alerts
  - `/api/notifications/slack`: Endpoint for sending Slack alerts
  - `/api/scheduled/webhook-health-check`: Scheduled health monitoring

## Testing Webhooks
You can test the webhook endpoints using the following URLs:

- FinGoal Webhook: `https://nvswlwitpguxubguhdef.supabase.co/functions/v1/fingoal-webhook`
- Yodlee Webhook: `https://nvswlwitpguxubguhdef.supabase.co/functions/v1/yodlee-webhook`

To test a webhook from your application:

```javascript
// Example test call to FinGoal webhook
fetch('https://nvswlwitpguxubguhdef.supabase.co/functions/v1/fingoal-webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    event: 'transaction_enrichment',
    transactions: [
      {
        id: 'test-transaction-123',
        amount: 42.99,
        description: 'Test Transaction'
      }
    ]
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## Understanding the Dashboard
The webhook monitoring dashboard is available at `/admin/webhooks` in your application. It provides:

- **Webhook Statistics**: Success rates, total counts, and failure counts over time
- **Average Processing Time**: Performance metrics to identify slow webhooks
- **Recent Events**: List of the most recent webhook events with status information
- **Distribution by Source**: Breakdown of webhook events by source (Yodlee, FinGoal, etc.)
- **Distribution by Event Type**: Breakdown of webhook events by type
- **Failed Events**: Dedicated section showing recent failures with details
- **Real-time Alerts**: Visual indicators when performance issues are detected

## Alert System
The alert system automatically monitors webhook health and generates alerts when:

1. **High Failure Rate**: When the success rate falls below a configurable threshold
2. **Consecutive Failures**: When multiple webhook calls fail sequentially
3. **Slow Response Time**: When processing time exceeds normal thresholds

Alerts can be configured to send notifications through:
- Email (to administrators)
- Slack channels
- Dashboard notifications

Configure alert thresholds in the WebhookAlerts utility:
```typescript
// Default thresholds for alerts
static defaultThresholds: AlertThresholds = {
  failureRate: 20, // Alert if failure rate is above 20%
  consecutiveFailures: 3, // Alert if 3 consecutive failures
  responseTime: 5000, // Alert if response time is above 5000ms
};
```

## FinGoal Batch Processing
Batch processing for FinGoal is handled by the `schedule-batch` edge function. This allows for grouping of transaction enrichment requests to optimize API usage.

The batch scheduler:
- Groups transactions to minimize API calls
- Prioritizes processing based on age and importance
- Handles retries for failed enrichment attempts
- Logs detailed batch processing statistics

## Troubleshooting
If webhooks are not processing correctly:

1. Check the `webhook_events` table for failed events:
   ```sql
   SELECT * FROM webhook_events WHERE status = 'failed' ORDER BY created_at DESC LIMIT 10;
   ```

2. Verify that the edge functions are active:
   ```
   Supabase Functions List:
   - fingoal-webhook
   - yodlee-webhook
   - webhook-dashboard
   - schedule-batch
   - send-email
   ```

3. Test webhook ingestion with the built-in test function:
   ```sql
   SELECT test_webhook_ingestion(
     'fingoal',
     'transaction_enrichment',
     '{"transactions": [{"id": "test-id", "amount": 99.99}]}'
   );
   ```

4. Check active alerts:
   ```sql
   SELECT * FROM webhook_alerts WHERE resolved = false ORDER BY created_at DESC;
   ```

5. Review notification logs:
   ```sql
   SELECT * FROM notification_logs ORDER BY created_at DESC LIMIT 20;
   ```

## Best Practices
- Regularly monitor the webhook dashboard for failed events
- Set up automated health checks to run every 15-30 minutes
- Keep alert thresholds adjusted based on normal operation patterns
- Implement runbooks for responding to different alert types
- Conduct regular audits of webhook performance metrics
- Set up a dedicated Slack channel for webhook alerts

## Scheduled Health Checks
Automated health checks run periodically to monitor webhook health:

1. Configure a CRON job to call the health check endpoint:
   ```
   */15 * * * * curl -X GET -H "Authorization: Bearer ${WEBHOOK_HEALTH_CHECK_SECRET}" https://app.finfy.ai/api/scheduled/webhook-health-check
   ```

2. Set the `WEBHOOK_HEALTH_CHECK_SECRET` environment variable to secure access.

3. The health check will:
   - Verify all webhook sources are functioning
   - Detect performance degradation
   - Send notifications for new issues
   - Update status of existing alerts

## Database Schema
The webhook monitoring system uses two main tables:

1. `webhook_events`: Stores all incoming webhook events
2. `enrichment_batches`: Tracks scheduled and processed batches for transaction enrichment

Additionally, it utilizes several stored procedures:
- `get_webhook_stats`: Retrieves webhook statistics for the dashboard
- `get_recent_webhook_events`: Gets the most recent webhook events
- `test_webhook_ingestion`: Allows manual testing of webhook processing 