# FinGoal Integration Guide

This document provides an overview of the FinGoal integration in the Finfy application, which provides transaction enrichment, user tagging, and savings recommendations.

## Overview

FinGoal's Insights API enhances transaction data with cleaner descriptions, categorization, and smart tagging, making it easier for users to understand their spending patterns. It also provides personalized savings recommendations based on transaction history.

## Features

The integration includes:

1. **Transaction Enrichment**: Enhances raw transaction data with:
   - Cleaned and standardized merchant names
   - Accurate categorization and subcategorization
   - Transaction-level tagging

2. **User Tagging**: Analyzes spending patterns to tag users with relevant attributes
   - Identifies user behaviors and preferences
   - Provides insights into financial habits
   
3. **Savings Recommendations**: Generates personalized savings opportunities
   - Credit card recommendations
   - Subscription optimization
   - Merchant-specific offers

## Implementation Details

### API Client

The integration uses a custom API client (`src/utils/fingoal-api/index.ts`) that handles:

- Authentication with JWT tokens
- Transaction submission for enrichment
- Retrieving enriched data
- Handling savings recommendations

### Data Flow

1. **Transaction Collection**: Transactions from Yodlee/Plaid are transformed to FinGoal format
2. **Enrichment Submission**: Transactions are submitted in batches to FinGoal's API
3. **Webhook Notifications**: Webhooks notify the application when enrichment is complete
4. **Data Storage**: Enriched data is stored in the application database
5. **UI Presentation**: Enhanced transaction data and recommendations are displayed to users

### Webhook Handling

The application implements webhook handlers for:

- Enrichment completion events
- User tag updates
- Savings recommendation events

## API Endpoints

### Transaction Enrichment

- **POST /api/fingoal/enrich-transactions**: Submit transactions for enrichment
  - Supports both recent (30 days) and historical enrichment
  
- **GET /api/fingoal/enrich-transactions**: Check enrichment status
  - Returns batch status and recent batches

### Savings Recommendations

- **GET /api/fingoal/savings-recommendations**: Get all savings recommendations for a user
  - Supports filtering by date range
  
- **GET /api/fingoal/savings-recommendations/:id**: Get a specific recommendation

### User Tags

- **GET /api/fingoal/user-tags/:userId**: Get all tags for a specific user
  - Provides insights into user financial behaviors

## Environment Variables

To use the FinGoal integration, set the following environment variables:

```
FINGOAL_BASE_URL=https://findmoney-dev.fingoal.com/v3
FINGOAL_CLIENT_ID=your-fingoal-client-id
FINGOAL_CLIENT_SECRET=your-fingoal-client-secret
FINGOAL_WEBHOOK_URL=https://your-app-url.com/api/fingoal/webhook
```

## Database Schema

The integration uses the following database tables:

- `fingoal_batches`: Tracks enrichment batch status
- `fingoal_user_tags`: Stores user tags from FinGoal
- `fingoal_savings_recommendations`: Stores savings recommendations
- `fingoal_tag_updates`: Tracks user tag update status

## UI Components

The integration includes UI components:

- `EnrichedTransactionItem`: Displays transaction with enriched data
- `SavingsRecommendationCard`: Displays savings recommendations
- `UserTagsDisplay`: Shows user tags with confidence levels

## Testing

To test the integration, use the test endpoint:

```javascript
import { testEnrichTransactions } from '@/utils/fingoal-api';

// Example transaction for testing
const transaction = {
  uid: "user123",
  accountid: "account456",
  amountnum: 12.41,
  date: "2024-05-11",
  original_description: "T0064 TARGET STORE",
  transactionid: "tx789",
  accountType: "creditCard",
  settlement: "debit"
};

// Test enrichment
const enrichedData = await testEnrichTransactions([transaction]);
console.log(enrichedData);
```

## Webhook Registration

To receive webhook notifications:

1. Contact FinGoal support at support@fingoal.com
2. Provide your webhook URL (e.g., https://your-app.com/api/fingoal/webhook)
3. Update the `FINGOAL_WEBHOOK_URL` environment variable

## Production Considerations

- Use the asynchronous endpoints (`/cleanup` and `/cleanup/streaming`) for production
- Group transactions by user for optimal performance
- Limit batch sizes to 1,000 transactions
- Implement webhook signature verification

## Resources

- [FinGoal API Documentation](https://docs.fingoal.dev/)
- [FinGoal Categories List](https://docs.fingoal.dev/categories)
- [FinGoal Tags List](https://docs.fingoal.dev/tags) 