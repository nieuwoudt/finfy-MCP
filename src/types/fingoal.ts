export interface FinGoalTransactionInput {
  uid: string;
  transactionid: string;
  accountid?: string;
  amountnum: number;
  date: string;
  original_description: string;
  accountType: string;
  settlement: string;
  simple_description?: string;
  category?: string;
  high_level_category?: string;
  payer_name?: string;
}

export interface FinGoalEnrichmentResponse {
  status: {
    transactions_received: boolean;
    transactions_validated: boolean;
    processing: boolean;
    num_transactions_processing: number;
    batch_request_id: string;
  };
}

export interface EnrichedTransaction {
  uid: string;
  transactionid: string;
  accountid?: string;
  amountnum: number;
  date: string;
  original_description: string;
  simple_description: string;
  category: string;
  category_id: string;
  merchant_name: string;
  tags: string[];
  updated_at: string;
  account_type?: string;
  settlement?: string;
  high_level_category?: string;
  primary_tag?: string;
  custom_tags?: string[];
}

export interface EnrichedTransactionsResponse {
  enrichedTransactions: EnrichedTransaction[];
  failedTransactions?: any[];
}

export interface FinGoalUserTag {
  id: string;
  name: string;
  confidence: number;
  tag_type: string;
  tag_description: string;
}

export interface FinGoalUser {
  client_id: string;
  id: string;
  uid: string;
  uniqueId: string;
  lifetimeSavings: number;
  registrationDate: string;
  subtenantId: string;
  tags: FinGoalUserTag[];
  totaltransactions: number;
  transactionsSinceLastUpdate: number;
}

export interface FinGoalUserResponse {
  user: FinGoalUser;
  transactions?: any[];
}

export interface FinGoalUserTagUpdateResponse {
  userTags: {
    created: FinGoalUserTag[];
    deleted: FinGoalUserTag[];
  };
}

export interface FinGoalTagStatusWebhook {
  guid: string;
}

export interface FinGoalWebhookBase {
  batch_request_id: string;
}

export interface FinGoalSavingsRecommendation {
  finsight_id: string;
  uniqueId: string;
  user_id: string;
  transaction_id: string;
  insight_ctaurl: string;
  finsight_image: string;
  insight_text: string;
  recommendation: string;
  amountFound: number;
  category: string;
  finsightDate?: string;
  retries?: number;
  webhookSent?: boolean;
  webhookUri?: string;
  lastAttempt?: string;
}

export interface FinGoalSavingsRecommendationsResponse {
  finsights: FinGoalSavingsRecommendation[];
}

// Adapter interfaces for normalizing data between providers
export interface NormalizedTransaction {
  // Common fields used across all providers
  provider: 'plaid' | 'yodlee' | 'fingoal';
  transaction_id: string;
  user_id: string;
  account_id: string;
  amount: number;
  date: string;
  description: string;
  merchant_name: string;
  category: string;
  category_id: string;
  category_hierarchy?: string[];
  payment_channel?: string;
  pending?: boolean;
  currency_code?: string;
  tags?: string[];
  enriched?: boolean;
  enrichment_data?: any;
  
  // Original data
  original_data: any;
} 