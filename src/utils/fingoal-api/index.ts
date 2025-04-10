import axios from 'axios';
import { config } from '@/config/env';

// Types for FinGoal API
export interface FinGoalTransaction {
  uid: string;
  accountid: string;
  amountnum: number;
  date: string;
  original_description: string;
  transactionid: string;
  accountType?: string;
  settlement?: 'debit' | 'credit';
  // Additional fields can be added as needed
}

export interface EnrichedTransaction {
  uid: string;
  transactionid: string;
  amountnum: number;
  date: string;
  original_description: string;
  simple_description?: string;
  merchant_name?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  // Additional fields can be added as needed
}

export interface AuthResponse {
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}

export interface BatchStatus {
  transactions_received: boolean;
  transactions_validated: boolean;
  processing: boolean;
  num_transactions_processing: number;
  batch_request_id: string;
}

// Create axios instance for FinGoal API
const fingoalApi = axios.create({
  baseURL: config.FINGOAL_BASE_URL || 'https://findmoney-dev.fingoal.com/v3',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generate a JWT authentication token for FinGoal API
 */
export const getFinGoalAuthToken = async (): Promise<string> => {
  try {
    const response = await fingoalApi.post('/authentication', {
      client_id: config.FINGOAL_CLIENT_ID,
      client_secret: config.FINGOAL_CLIENT_SECRET,
    });

    const authData: AuthResponse = response.data;
    return authData.access_token;
  } catch (error) {
    console.error('Error getting FinGoal auth token:', error);
    throw error;
  }
};

/**
 * Set the authentication token for future requests
 */
export const setAuthToken = (token: string) => {
  fingoalApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Submit transactions for test enrichment (synchronous, for testing only)
 */
export const testEnrichTransactions = async (transactions: FinGoalTransaction[]): Promise<EnrichedTransaction[]> => {
  try {
    const response = await fingoalApi.post('/cleanup/sync', { 
      transactions 
    });
    
    return response.data.enrichedTransactions.enriched || [];
  } catch (error) {
    console.error('Error enriching transactions (test):', error);
    throw error;
  }
};

/**
 * Submit transactions for historical enrichment (asynchronous, for large batches)
 */
export const historicalEnrichTransactions = async (transactions: FinGoalTransaction[]): Promise<BatchStatus> => {
  try {
    const response = await fingoalApi.post('/cleanup', { 
      transactions 
    });
    
    return response.data.status;
  } catch (error) {
    console.error('Error submitting transactions for historical enrichment:', error);
    throw error;
  }
};

/**
 * Submit transactions for streaming enrichment (asynchronous, for daily batches)
 */
export const streamingEnrichTransactions = async (transactions: FinGoalTransaction[]): Promise<BatchStatus> => {
  try {
    const response = await fingoalApi.post('/cleanup/streaming', { 
      transactions 
    });
    
    return response.data.status;
  } catch (error) {
    console.error('Error submitting transactions for streaming enrichment:', error);
    throw error;
  }
};

/**
 * Retrieve enriched transactions by batch request ID
 */
export const getEnrichedTransactionsByBatchId = async (batchRequestId: string): Promise<EnrichedTransaction[]> => {
  try {
    const response = await fingoalApi.get(`/cleanup/${batchRequestId}`);
    
    return response.data.enrichedTransactions || [];
  } catch (error) {
    console.error('Error retrieving enriched transactions:', error);
    throw error;
  }
};

/**
 * Submit transactions for savings recommendations
 */
export const submitTransactionsForSavings = async (
  transactions: FinGoalTransaction[], 
  type: 'fingoal' | 'plaid' | 'mx' = 'fingoal'
): Promise<{ message: string }> => {
  try {
    const response = await fingoalApi.post('/transactions', 
      { transactions },
      { headers: { type } }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error submitting transactions for savings recommendations:', error);
    throw error;
  }
};

/**
 * Get a specific savings recommendation by ID
 */
export const getSavingsRecommendation = async (finsightId: string): Promise<any> => {
  try {
    const response = await fingoalApi.get(`/finsights/${finsightId}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving savings recommendation:', error);
    throw error;
  }
};

/**
 * Get many savings recommendations
 */
export const getSavingsRecommendations = async (startAt?: string, endAt?: string): Promise<any> => {
  try {
    const params: Record<string, string> = {};
    if (startAt) params.startAt = startAt;
    if (endAt) params.endAt = endAt;
    
    const response = await fingoalApi.get('/finsights', { params });
    return response.data;
  } catch (error) {
    console.error('Error retrieving savings recommendations:', error);
    throw error;
  }
};

export default {
  getFinGoalAuthToken,
  setAuthToken,
  testEnrichTransactions,
  historicalEnrichTransactions,
  streamingEnrichTransactions,
  getEnrichedTransactionsByBatchId,
  submitTransactionsForSavings,
  getSavingsRecommendation,
  getSavingsRecommendations
}; 