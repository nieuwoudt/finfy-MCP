import { Transaction } from "@/types";
import { NormalizedTransaction, EnrichedTransaction } from "@/types/fingoal";

/**
 * Normalizes a Plaid transaction to a common format
 */
export const normalizePlaidTransaction = (
  transaction: any, 
  userId: string
): NormalizedTransaction => {
  return {
    provider: 'plaid',
    transaction_id: transaction.transaction_id,
    user_id: userId,
    account_id: transaction.account_id,
    amount: transaction.amount,
    date: transaction.date,
    description: transaction.name || transaction.original_description || '',
    merchant_name: transaction.merchant_name || '',
    category: transaction.personal_finance_category?.primary || transaction.category?.[0] || '',
    category_id: transaction.category_id || '',
    category_hierarchy: transaction.category || [],
    payment_channel: transaction.payment_channel || '',
    pending: transaction.pending || false,
    currency_code: transaction.iso_currency_code || '',
    tags: [],
    enriched: false,
    original_data: transaction
  };
};

/**
 * Normalizes a Yodlee transaction to a common format
 */
export const normalizeYodleeTransaction = (
  transaction: any, 
  userId: string
): NormalizedTransaction => {
  return {
    provider: 'yodlee',
    transaction_id: transaction.id ? transaction.id.toString() : '',
    user_id: userId,
    account_id: transaction.account_id ? transaction.account_id.toString() : '',
    amount: transaction.amount?.amount || 0,
    date: transaction.date || '',
    description: transaction.description?.original || '',
    merchant_name: '',
    category: transaction.category || '',
    category_id: transaction.category_id ? transaction.category_id.toString() : '',
    category_hierarchy: [transaction.category || ''],
    currency_code: transaction.amount?.currency || '',
    pending: transaction.status === 'PENDING',
    tags: [],
    enriched: false,
    original_data: transaction
  };
};

/**
 * Converts a normalized transaction to FinGoal input format
 */
export const toFinGoalTransactionInput = (
  transaction: NormalizedTransaction
) => {
  return {
    uid: transaction.user_id,
    transactionid: transaction.transaction_id,
    accountid: transaction.account_id,
    amountnum: transaction.amount,
    date: transaction.date,
    original_description: transaction.description,
    accountType: transaction.provider === 'plaid' 
      ? transaction.original_data.account_type || 'checking'
      : 'checking',
    settlement: transaction.amount > 0 ? 'credit' : 'debit'
  };
};

/**
 * Updates a normalized transaction with enrichment data from FinGoal
 */
export const enrichTransactionWithFinGoalData = (
  transaction: NormalizedTransaction,
  enrichedData: EnrichedTransaction
): NormalizedTransaction => {
  return {
    ...transaction,
    merchant_name: enrichedData.merchant_name || transaction.merchant_name,
    category: enrichedData.category || transaction.category,
    category_id: enrichedData.category_id || transaction.category_id,
    tags: enrichedData.tags || [],
    enriched: true,
    enrichment_data: enrichedData
  };
};

/**
 * Converts a normalized transaction to Supabase format for storage
 */
export const toSupabaseTransactionFormat = (transaction: NormalizedTransaction) => {
  const base = {
    transaction_id: transaction.transaction_id,
    user_id: transaction.user_id,
    account_id: transaction.account_id,
    amount: transaction.amount,
    date: transaction.date,
    name: transaction.description,
    merchant_name: transaction.merchant_name,
    category: Array.isArray(transaction.category_hierarchy) 
      ? transaction.category_hierarchy 
      : [transaction.category],
    category_id: transaction.category_id,
    payment_channel: transaction.payment_channel,
    pending: transaction.pending,
    iso_currency_code: transaction.currency_code,
    provider: transaction.provider,
    tags: transaction.tags,
    enriched: transaction.enriched,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    
    // Store the full original and enrichment data as JSON
    original_data: JSON.stringify(transaction.original_data),
    enrichment_data: transaction.enrichment_data 
      ? JSON.stringify(transaction.enrichment_data) 
      : null
  };
  
  // Add additional fields based on provider
  if (transaction.provider === 'plaid') {
    return {
      ...base,
      authorized_date: transaction.original_data.authorized_date || null,
      authorized_datetime: transaction.original_data.authorized_datetime || null,
      location: JSON.stringify(transaction.original_data.location) || null,
      payment_meta: JSON.stringify(transaction.original_data.payment_meta) || null,
      personal_finance_category: JSON.stringify(transaction.original_data.personal_finance_category) || null,
      transaction_type: transaction.original_data.transaction_type || null,
    };
  }
  
  if (transaction.provider === 'yodlee') {
    return {
      ...base,
      category_type: transaction.original_data.category_type || null,
      high_level_category_id: transaction.original_data.high_level_category_id || null,
      description_original: transaction.original_data.description_original || null,
      transaction_date: transaction.original_data.transaction_date || null,
      post_date: transaction.original_data.post_date || null,
    };
  }
  
  return base;
}; 