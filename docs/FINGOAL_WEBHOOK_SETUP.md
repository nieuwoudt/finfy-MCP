# Fingoal Webhook Setup Guide

This document outlines the steps needed to set up the webhook for Fingoal integration with Finfy.

## Overview

Fingoal uses a webhook-based asynchronous flow for both historical and streaming enrichment. This means Fingoal will send notifications to our application when transaction enrichment is complete, when user tags are updated, or when new savings recommendations are available.

## Prerequisites

1. Fingoal API credentials (already configured):
   - Client ID: `pfkcwbBX3Tm2pQqqP3Wg9MVeUGCQjCmc`
   - Client Secret: `K-93cN1eTRpkLWwFr2HWl8j-HIHE1nkG8LpfK0MOBsvM_xjz1w4yB35QT3ILdkWb`

2. A publicly accessible HTTPS URL for receiving webhook notifications

## Webhook Registration Steps

1. **Use the following webhook URLs**:
   - For Development/Testing Environment: `https://staging.finfy.ai/api/fingoal/webhook`
   - For Production Environment: `https://app.finfy.ai/api/fingoal/webhook`

2. **Contact Fingoal Support**:
   - Send an email to support@fingoal.com
   - Subject: "Webhook Registration for Finfy"
   - Include your webhook URLs for both development and production environments
   - Specify that you need **data-rich webhooks** for:
     - Transaction enrichment completion
     - User tag updates
   - Note: We are temporarily not using savings recommendations
     
3. **Add Environment Variable**:
   - Add `FINGOAL_WEBHOOK_URL` to your environment variables:
     ```
     FINGOAL_WEBHOOK_URL=https://staging.finfy.ai/api/fingoal/webhook  # for staging
     FINGOAL_WEBHOOK_URL=https://app.finfy.ai/api/fingoal/webhook      # for production
     ```

## Webhook Verification

Fingoal signs each webhook request with an HMAC signature. Our application verifies this signature to ensure the webhook is legitimate.

The signature is sent in the `X-Webhook-Verification` header and is a SHA-256 HMAC signature of the webhook payload, using your Client Secret as the key.

Our application already implements this verification in the webhook handler.

## Webhook Types

The Fingoal webhook endpoints handle two types of webhooks:

1. **Enrichment Completion**:
   - Data-rich payload containing the enriched transaction data
   - This allows us to directly store the enrichment without additional API calls

2. **User Tag Updates**:
   - Direct Tag Payload: `{ "userTags": { "created": [...], "deleted": [...] } }`
   - Status Payload: `{ "guid": "uuid" }`

## Data-Rich vs Non-Data-Rich Webhooks

We have chosen to use data-rich webhooks for the following reasons:
1. **Reduced API Calls**: Eliminates the need to make additional calls to fetch enriched data
2. **Lower Latency**: Transaction data is immediately available after receiving the webhook
3. **Improved Reliability**: No dependence on additional API availability
4. **Simplified Processing**: Data can be stored directly from the payload

## Testing Webhooks

For development, you can use a service like [ngrok](https://ngrok.com/) to expose your local development server to the internet.

1. Start your local server
2. Run ngrok: `ngrok http 3000`
3. Use the generated URL as your webhook URL: `https://[ngrok-url]/api/fingoal/webhook`
4. Send this temporary URL to Fingoal support for testing

## Production Configuration

For production, ensure:

1. The webhook URL is publicly accessible
2. HTTPS is properly configured
3. The webhook handler can handle high request volumes
4. Proper error handling and logging are in place

## Troubleshooting

If webhooks are not being received:

1. Check that Fingoal has registered your webhook URL
2. Verify the URL is publicly accessible
3. Check server logs for any errors
4. Ensure the webhook signature verification is working correctly

If enrichment data is not being processed:

1. Check the enrichment_batches table for the status of batches
2. Verify the transaction_tags table is being populated
3. Check for any errors in the webhook handler logs

## Note on Savings Recommendations

As of [current date], we have temporarily disabled the savings recommendations feature based on advice from Fingoal. They are working on a new, more powerful version that will be released later this year. We will integrate with this new version once it becomes available. 