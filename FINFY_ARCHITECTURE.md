# Finfy Platform Architecture & Data Flow

## Overview for AI Engineer

Here's a comprehensive breakdown of the Finfy platform's data flow, from user onboarding to data enrichment and AI-powered financial insights:

## 1. User Onboarding

When a user signs up:

1. User creates an account in the Finfy platform
2. User data is stored in Supabase (`profiles` table)
3. Authentication is handled via Supabase Auth
4. User is prompted to connect their financial accounts

## 2. Financial Account Connection

Users have two options to connect their bank accounts:

### Option A: Plaid Integration
- User selects Plaid as their connection method
- Plaid Link is initialized with `PLAID_CLIENT_ID` and environment settings
- User authenticates with their bank through Plaid's secure interface
- Plaid returns access tokens and account IDs
- These tokens are stored securely in Supabase

### Option B: Yodlee Integration
- User selects Yodlee (primarily for South African banks - note `selected_country === "ZA"` check)
- Yodlee FastLink is loaded via script: `https://cdn.yodlee.com/fastlink/v4/initialize.js`
- Access token is created via `/api/yodlee/create-access-token`
- User authenticates with their bank through Yodlee's interface
- Upon successful connection, we receive:
  - `providerAccountId`
  - `requestId`
  - `providerId`

## 3. Data Retrieval & Storage

After successful connection:

### For Yodlee:
1. `fetchAccounts()` retrieves account data using:
   ```javascript
   axiosInternal("/api/yodlee/accounts", {
     params: {
       accessToken: token,
       providerAccountId,
       requestId,
     }
   })
   ```
   
2. Provider info is fetched simultaneously:
   ```javascript
   axiosInternal("/api/yodlee/providers", {
     params: {
       accessToken: token,
       providerId,
     }
   })
   ```

3. Account data is stored in Supabase via `saveAccountYodlee()`:
   - Data goes into `accounts_yodlee` table
   - Fields include: account_id, container, provider_account_id, account_name, balance_amount, etc.

4. Transactions are fetched using account IDs:
   ```javascript
   axiosInternal("/api/yodlee/transactions", {
     params: {
       accessToken: token,
       accountIds,
     }
   })
   ```

5. Transaction data is stored via `saveTransactionsYodlee()`:
   - Data goes into `transactions_yodlee` table
   - Fields include: transaction_id, amount, currency, category, date, description, etc.

### For Plaid:
- Similar flow but using Plaid-specific endpoints
- Data is stored in corresponding Plaid tables

## 4. Data Enrichment via FinGoal

After bank data is retrieved:

1. Transactions are prepared for enrichment in `enrichTransactions()`:
   ```javascript
   const fingoalTransactions = transactions.map(t => ({
     uid: userId,
     transactionid: t.transaction_id,
     accountid: t.account_id,
     amountnum: parseFloat(t.amount),
     date: t.date,
     original_description: t.description,
     accountType: t.account_type || "depositAccount",
     settlement: t.amount < 0 ? "debit" : "credit"
   }));
   ```

2. Transactions are sent to FinGoal for enrichment:
   ```javascript
   const response = await axios.post(
     `${this.baseUrl}/batch`,
     { transactions },
     {
       headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
       },
     }
   );
   ```

3. FinGoal processes the transactions and returns a batch ID:
   ```javascript
   batch_id: enrichmentResponse.status.batch_request_id
   ```

4. The batch ID is stored in Supabase:
   ```javascript
   await supabase
     .from("enrichment_batches")
     .insert({
       batch_id: enrichmentResponse.status.batch_request_id,
       status: "processing",
       transaction_count: transactions.length,
       created_at: new Date().toISOString()
     });
   ```

## 5. Webhook Processing

1. FinGoal sends enriched data back via webhook to:
   ```
   FINGOAL_WEBHOOK_URL=https://nvswlwitpguxubguhdef.supabase.co/functions/v1/fingoal-webhook
   ```

2. The webhook endpoint processes the enriched data:
   - Verifies the webhook signature
   - Extracts enriched transaction data
   - Stores enrichment data in `transaction_tags` table
   - Each transaction gets tags, categories, and insights

## 6. Enriched Data Structure

The enriched data includes:

1. **Transaction Tags**: Financial behavior indicators
   - Example: "frequent-coffee-buyer", "high-grocery-spender"
   - Stored in `transaction_tags` table with relation to transaction_id

2. **Categories and Subcategories**:
   - More precise than bank-provided categories
   - Examples: "Food & Dining > Coffee Shops", "Shopping > Electronics"

3. **Insights**:
   - Patterns and observations about spending habits
   - Anomaly detection for unusual transactions

## 7. MCP Integration for AI Context Window

For the Model Context Protocol (MCP) integration:

1. The `FinifyMcpServer` class in `server.ts` handles context generation:
   ```javascript
   private registerTools() {
     // Register our primary tool - get_context_block
     const getContextBlockTool = async ({ user_id, max_tokens = 1000000 }: ToolArgs): Promise<ToolResult> => {
       // Fetch user profile, transactions, accounts, and enrichment data
       // Format into context block
     }
   }
   ```

2. The context block generation process:
   - Fetches user profile from `profiles` table
   - Retrieves transactions from `transactions_yodlee` table (last 24 months)
   - Gets accounts from `accounts_yodlee` table
   - Pulls user tags and transaction enrichment data
   - Formats everything into a readable markdown context block

3. The formatted context block includes:
   - User profile information
   - User financial behavior tags
   - Account summary with balances
   - Recent transactions with enrichment tags
   - Monthly spending summary by category

4. This context block is sent to the LLM (GPT-4.1) via:
   ```javascript
   async generateLLMResponse(userId: string, userQuery: string): Promise<string> {
     // Get the context block
     const contextBlock = await this.getContextBlock(userId);
     
     // Construct prompt with context
     const messages = [
       {
         role: "system",
         content: `You are a helpful financial assistant for Finfy. 
         
         You have access to the user's financial data which is provided below.
         Use this information to provide accurate, personalized financial insights.
         ${contextBlock}`
       },
       {
         role: "user", 
         content: userQuery
       }
     ];
     
     // Call OpenAI with context-enriched prompt
     // ...
   }
   ```

## 8. User Query Flow

1. User asks a question about their finances in the UI
2. Question is sent to the MCP client
3. MCP client retrieves the context block with all financial data
4. Context + question are sent to OpenAI GPT-4.1
5. AI generates personalized financial insights based on the enriched data
6. Response is displayed to the user

## Technical Implementation Notes

1. **Browser Compatibility**: The code has been modified to work in both server and browser environments with conditional checks:
   ```javascript
   if (typeof window !== 'undefined') {
     // Browser-safe code
   } else {
     // Server-only code
   }
   ```

2. **Error Handling**: The system has robust error handling for API failures, with fallbacks to database queries when external services are unavailable.

3. **Data Privacy**: Sensitive financial data is stored in Supabase with appropriate security measures.

4. **Webhook Security**: Webhook signatures are verified to ensure data authenticity.

This architecture enables users to connect their financial accounts, automatically enriches their transaction data, and provides AI-powered insights through a context-augmented LLM integration. 