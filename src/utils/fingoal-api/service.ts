import { createClient } from '@supabase/supabase-js';
import { getFinGoalAuthToken, setAuthToken, streamingEnrichTransactions, historicalEnrichTransactions, FinGoalTransaction } from './index';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface YodleeTransaction {
  id: string;
  accountId: number;
  amount: {
    amount: number;
    currency: string;
  };
  baseType: string;
  categoryType: string;
  categoryId: number;
  category: string;
  description: {
    original: string;
    simple: string;
  };
  date: string;
  merchant?: {
    id: string;
    name: string;
    categoryLabel: string[];
  };
  user_id: string;
}

/**
 * Transform Yodlee transactions to FinGoal format
 */
export const transformToFinGoalFormat = (
  transactions: YodleeTransaction[],
  userId: string
): FinGoalTransaction[] => {
  return transactions.map((transaction) => ({
    uid: userId,
    accountid: String(transaction.accountId),
    amountnum: transaction.amount.amount,
    date: transaction.date.split('T')[0], // Format date as YYYY-MM-DD
    original_description: transaction.description.original,
    transactionid: transaction.id,
    accountType: transaction.baseType === 'DEBIT' ? 'creditCard' : 'bankAccount',
    settlement: transaction.baseType === 'DEBIT' ? 'debit' : 'credit',
  }));
};

/**
 * Submit recent transactions for enrichment using the streaming endpoint
 */
export const submitRecentTransactionsForEnrichment = async (userId: string) => {
  try {
    // Get token and set auth header
    const token = await getFinGoalAuthToken();
    setAuthToken(token);

    // Fetch user's recent transactions from the database (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);
      
    if (error || !transactions) {
      console.error('Error fetching transactions:', error);
      return { success: false, error };
    }
    
    if (transactions.length === 0) {
      return { success: true, batchRequestId: null, message: 'No recent transactions found' };
    }
    
    // Transform transactions to FinGoal format
    const fingoalTransactions = transformToFinGoalFormat(transactions, userId);
    
    // Submit transactions for streaming enrichment
    const result = await streamingEnrichTransactions(fingoalTransactions);
    
    // Store batch request ID in the database
    if (result.batch_request_id) {
      await supabase
        .from('fingoal_batches')
        .insert({
          batch_request_id: result.batch_request_id,
          user_id: userId,
          status: 'processing',
          created_at: new Date().toISOString(),
          transaction_count: transactions.length,
        });
    }
    
    return { 
      success: true, 
      batchRequestId: result.batch_request_id,
      transactionCount: transactions.length
    };
  } catch (error) {
    console.error('Error submitting transactions for enrichment:', error);
    return { success: false, error };
  }
};

/**
 * Submit historical transactions for enrichment
 */
export const submitHistoricalTransactionsForEnrichment = async (userId: string) => {
  try {
    // Get token and set auth header
    const token = await getFinGoalAuthToken();
    setAuthToken(token);

    // Fetch user's historical transactions from the database
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);
      
    if (error || !transactions) {
      console.error('Error fetching transactions:', error);
      return { success: false, error };
    }
    
    if (transactions.length === 0) {
      return { success: true, batchRequestId: null, message: 'No transactions found' };
    }
    
    // Transform transactions to FinGoal format
    const fingoalTransactions = transformToFinGoalFormat(transactions, userId);
    
    // Process transactions in batches of 1000 if needed
    const batchSize = 1000;
    const batches = [];
    for (let i = 0; i < fingoalTransactions.length; i += batchSize) {
      batches.push(fingoalTransactions.slice(i, i + batchSize));
    }
    
    // Submit each batch
    const results = [];
    for (const batch of batches) {
      const result = await historicalEnrichTransactions(batch);
      
      // Store batch request ID in the database
      if (result.batch_request_id) {
        await supabase
          .from('fingoal_batches')
          .insert({
            batch_request_id: result.batch_request_id,
            user_id: userId,
            status: 'processing',
            created_at: new Date().toISOString(),
            transaction_count: batch.length,
          });
      }
      
      results.push(result);
    }
    
    return { 
      success: true, 
      batchCount: batches.length,
      batchResults: results,
      totalTransactions: fingoalTransactions.length
    };
  } catch (error) {
    console.error('Error submitting historical transactions for enrichment:', error);
    return { success: false, error };
  }
};

export default {
  transformToFinGoalFormat,
  submitRecentTransactionsForEnrichment,
  submitHistoricalTransactionsForEnrichment,
}; 