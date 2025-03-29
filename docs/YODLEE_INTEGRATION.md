# Yodlee Integration

This document outlines how to set up and use the Yodlee FastLink 4 integration in the Finfy application.

## Overview

The integration uses Yodlee's FastLink 4 to allow users to:
- Connect their financial accounts securely
- Aggregate transaction data
- Verify account details
- Receive updates through webhooks

## Setup Steps

### 1. Environment Variables

Update your `.env.local` file with the Yodlee credentials provided via email:

```
# Yodlee integration
YODLEE_BASE_URL=<BASE_URL_FROM_CREDENTIALS>
YODLEE_CLIENT_ID=<CLIENT_ID_FROM_CREDENTIALS>
YODLEE_CLIENT_SECRET=<CLIENT_SECRET_FROM_CREDENTIALS>
YODLEE_API_VERSION=1.1
YODLEE_LOGIN_NAME=<ADMIN_LOGIN_NAME_FROM_CREDENTIALS>
YODLEE_FASTLINK_URL=<FASTLINK4_URL_FROM_CREDENTIALS>
NEXT_PUBLIC_YODLEE_FASTLINK_URL=<FASTLINK4_URL_FROM_CREDENTIALS>
NEXT_PUBLIC_SITE_URL=<YOUR_SITE_URL_FOR_WEBHOOKS>
YOADLEE_API=<BASE_URL_FROM_CREDENTIALS>
```

### 2. Database Setup

Run the setup script to apply the database schema:

```bash
npm run setup-yodlee
```

Alternatively, you can manually apply the SQL schema:

```bash
psql -d your_database_url -f ./supabase/schema-yodlee.sql
```

### 3. Webhook Configuration

The `setup-yodlee` script can configure webhooks automatically, or you can do it manually by:

1. Creating an access token
2. Registering the webhook with Yodlee for each event type
3. Ensuring your webhook endpoint is publicly accessible

Webhook URL: `https://your-domain.com/api/yodlee/webhook`

## Integration Components

### API Endpoints

- `/api/yodlee/create-access-token`: Creates a Yodlee access token
- `/api/yodlee/webhook`: Handles webhook events from Yodlee
- `/api/yodlee/register-webhook`: Registers webhooks with Yodlee
- `/api/yodlee/process-latest-data`: Processes data after a refresh
- `/api/yodlee/accounts`: Retrieves account information
- `/api/yodlee/transactions`: Retrieves transaction data
- `/api/yodlee/providers`: Retrieves provider information

### Frontend Integration

The `useYodlee` hook provides functions to:

- Launch the FastLink interface
- Process the data after linking accounts
- Track the connection status

Example usage:

```javascript
import { useYodlee } from '@/hooks/useYodlee';

function YourComponent() {
  const { open, isLinkReady, isAlreadyConnected, isLoading } = useYodlee();

  return (
    <button 
      onClick={open} 
      disabled={!isLinkReady || isAlreadyConnected || isLoading}
    >
      Connect Your Bank
    </button>
  );
}
```

### Database Schema

The integration uses the following tables:

- `accounts_yodlee`: Stores account information
- `transactions_yodlee`: Stores transaction data
- `provider_accounts`: Tracks provider accounts and refresh status
- `webhook_logs`: Logs webhook events
- `data_processing_status`: Tracks data processing jobs

## Testing

You can test the integration using the test credentials provided by Yodlee:

- Bank: DAG Site
- Username: YodTest.site16441.2
- Password: site16441.2

## Webhooks

The integration supports the following webhook events:

- `REFRESH`: Notifies when account refresh is complete
- `DATA_UPDATES`: Notifies about data changes
- `AUTO_REFRESH_UPDATES`: Notifies about auto-refresh status
- `LATEST_BALANCE_UPDATES`: Notifies about balance updates

## Configuration Options

FastLink 4 supports four configuration types:

1. `aggregation`: For aggregation only
2. `verification`: For verification only
3. `aggregation_and_verification`: For mandatory aggregation with optional verification
4. `verification_and_aggregation`: For mandatory verification with optional aggregation

The default configuration is `LiveConfiguration` which is set to use aggregation.

## Troubleshooting

Common issues:

1. **Webhook not receiving events**
   - Ensure the webhook URL is publicly accessible
   - Check that the webhook is properly registered
   - Verify the Yodlee credentials are correct

2. **FastLink not loading**
   - Check browser console for errors
   - Verify the FastLink script is loaded correctly
   - Ensure the access token is valid

3. **Data not saving**
   - Check the Supabase connection
   - Verify the database schema is applied correctly
   - Check for errors in the API response

For more assistance, contact Yodlee support or refer to their [documentation](https://developer.yodlee.com/docs/fastlink/4.0). 