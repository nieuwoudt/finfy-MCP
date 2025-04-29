#!/usr/bin/env node

/**
 * FinGoal Batch Scheduler
 * 
 * This script schedules transaction batch submissions to FinGoal at optimal times,
 * avoiding their peak processing hours (3-8am MST).
 * 
 * Recommended to run via cron:
 * 0 * * * * /path/to/finfy-ai/scripts/schedule-fingoal-batches.js
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const axios = require('axios');
const crypto = require('crypto');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

// FinGoal credentials
const fingoalClientId = process.env.FINGOAL_CLIENT_ID;
const fingoalClientSecret = process.env.FINGOAL_CLIENT_SECRET;
const fingoalBaseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://findmoney.fingoal.com/v3'
  : 'https://findmoney-dev.fingoal.com/v3';

if (!fingoalClientId || !fingoalClientSecret) {
  console.error('❌ Missing FinGoal credentials. Please check your .env.local file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get the current hour in Mountain Standard Time (MST)
 */
function getCurrentMSTHour() {
  // MST is UTC-7 (no daylight saving)
  const date = new Date();
  const utcHour = date.getUTCHours();
  const mstHour = (utcHour - 7 + 24) % 24;
  return mstHour;
}

/**
 * Check if current time is in FinGoal's peak hours (3-8am MST)
 */
function isDuringPeakHours() {
  const currentHour = getCurrentMSTHour();
  return currentHour >= 3 && currentHour < 8;
}

/**
 * Get authentication token from FinGoal
 */
async function getFinGoalToken() {
  try {
    const response = await axios.post(`${fingoalBaseUrl}/authentication`, {
      client_id: fingoalClientId,
      client_secret: fingoalClientSecret
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error getting FinGoal token:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Submit pending transactions for enrichment
 */
async function submitPendingTransactions() {
  try {
    // Skip during peak hours
    if (isDuringPeakHours()) {
      console.log('⏳ Current time is during FinGoal peak hours (3-8am MST). Skipping batch submission.');
      return;
    }
    
    console.log('🔄 Checking for pending transactions to submit to FinGoal...');
    
    // Get transactions that need enrichment
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('transaction_id, account_id, amount, date, description, user_id, account_type')
      .eq('enriched', false)
      .limit(500); // Process in batches of 500 max
    
    if (error) {
      throw new Error(`Error fetching transactions: ${error.message}`);
    }
    
    if (!transactions || transactions.length === 0) {
      console.log('✅ No pending transactions found.');
      return;
    }
    
    console.log(`📊 Found ${transactions.length} transactions to enrich.`);
    
    // Group transactions by user
    const transactionsByUser = {};
    transactions.forEach(tx => {
      if (!transactionsByUser[tx.user_id]) {
        transactionsByUser[tx.user_id] = [];
      }
      transactionsByUser[tx.user_id].push(tx);
    });
    
    // Get FinGoal token
    const token = await getFinGoalToken();
    
    // Process each user's transactions
    for (const userId in transactionsByUser) {
      const userTransactions = transactionsByUser[userId];
      console.log(`📤 Submitting ${userTransactions.length} transactions for user ${userId}...`);
      
      // Format transactions for FinGoal
      const fingoalTransactions = userTransactions.map(tx => ({
        uid: userId,
        transactionid: tx.transaction_id,
        accountid: tx.account_id,
        amountnum: parseFloat(tx.amount),
        date: tx.date,
        original_description: tx.description,
        accountType: tx.account_type || "depositAccount",
        settlement: tx.amount < 0 ? "debit" : "credit"
      }));
      
      // Submit to FinGoal
      const response = await axios.post(
        `${fingoalBaseUrl}/transactions/enriched`,
        { transactions: fingoalTransactions },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Store batch ID for tracking
      const batchId = response.data.status.batch_request_id;
      const { error: batchError } = await supabase
        .from('enrichment_batches')
        .insert({
          batch_id: batchId,
          status: 'processing',
          transaction_count: userTransactions.length,
          created_at: new Date().toISOString()
        });
      
      if (batchError) {
        console.error(`❌ Error storing batch ID: ${batchError.message}`);
      }
      
      // Mark transactions as pending enrichment
      const transactionIds = userTransactions.map(tx => tx.transaction_id);
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ enrichment_pending: true })
        .in('transaction_id', transactionIds);
      
      if (updateError) {
        console.error(`❌ Error updating transactions: ${updateError.message}`);
      }
      
      console.log(`✅ Batch ${batchId} submitted for user ${userId} with ${userTransactions.length} transactions.`);
    }
    
    console.log('✅ All pending transactions submitted for enrichment.');
  } catch (error) {
    console.error('❌ Error submitting transactions:', error.message);
  }
}

// Run the main function
submitPendingTransactions().catch(console.error); 