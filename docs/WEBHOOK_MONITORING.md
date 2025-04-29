# Finfy Webhook Monitoring System

## Overview
The Webhook Monitoring System tracks and debugs webhook events from external services such as FinGoal and Yodlee. It provides comprehensive insights into webhook performance, error rates, and processing details to help ensure the reliability of data integration with these services.

## Features
- **Webhook Event Logging**: All incoming webhook events are logged with source, type, payload, and processing status
- **Performance Metrics**: Track processing times to identify bottlenecks
- **Error Tracking**: Detailed error logging to diagnose issues quickly
- **Admin Dashboard**: Visual interface for monitoring webhook activity
- **Batch Scheduling**: Scheduled batch processing for FinGoal transaction enrichment

## Configuration
The webhook monitoring system is already configured and working with the following components:

- Database tables: `webhook_events` and `enrichment_batches`
- Edge Functions:
  - `fingoal-webhook`: Processes webhooks from FinGoal
  - `yodlee-webhook`: Processes webhooks from Yodlee
  - `webhook-dashboard`: Provides dashboard data for the admin interface
  - `schedule-batch`: Handles scheduling of batch processing

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

## FinGoal Batch Processing
Batch processing for FinGoal is handled by the `schedule-batch` edge function. This allows for grouping of transaction enrichment requests to optimize API usage.

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
   ```

3. Test webhook ingestion with the built-in test function:
   ```sql
   SELECT test_webhook_ingestion(
     'fingoal',
     'transaction_enrichment',
     '{"transactions": [{"id": "test-id", "amount": 99.99}]}'
   );
   ```

## Best Practices
- Regularly monitor the webhook dashboard for failed events
- Set up alerts for high failure rates
- Keep the webhook endpoints in your external services up to date
- Perform weekly audits of webhook performance metrics

## Database Schema
The webhook monitoring system uses two main tables:

1. `webhook_events`: Stores all incoming webhook events
2. `enrichment_batches`: Tracks scheduled and processed batches for transaction enrichment

Additionally, it utilizes several stored procedures:
- `get_webhook_stats`: Retrieves webhook statistics for the dashboard
- `get_recent_webhook_events`: Gets the most recent webhook events
- `test_webhook_ingestion`: Allows manual testing of webhook processing 