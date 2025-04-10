/**
 * Test script for Fingoal API transaction enrichment
 * 
 * This script tests the transaction enrichment capabilities of the Fingoal API
 * using the sync endpoint for immediate feedback.
 * 
 * Usage:
 * ts-node scripts/test-fingoal-enrichment.ts
 */

import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Extract credentials from environment variables
const clientId = process.env.FINGOAL_CLIENT_ID;
const clientSecret = process.env.FINGOAL_CLIENT_SECRET;
const baseUrl = process.env.FINGOAL_BASE_URL || 'https://findmoney-dev.fingoal.com/v3';

if (!clientId || !clientSecret) {
  console.error('Error: Fingoal credentials are missing!');
  console.error('Make sure FINGOAL_CLIENT_ID and FINGOAL_CLIENT_SECRET are set in .env.local');
  process.exit(1);
}

/**
 * Authenticate with Fingoal API
 */
async function authenticate() {
  try {
    console.log('Authenticating with Fingoal API...');
    
    const response = await axios.post(`${baseUrl}/authentication`, {
      client_id: clientId,
      client_secret: clientSecret
    });

    const { access_token } = response.data;
    console.log('✅ Authentication successful!');
    
    return access_token;
  } catch (error) {
    console.error('❌ Authentication failed!');
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error);
    }
    
    throw new Error('Authentication failed');
  }
}

/**
 * Test transaction enrichment using the sync endpoint
 */
async function testTransactionEnrichment(token: string) {
  try {
    console.log('\nTesting transaction enrichment with sync endpoint...');
    
    // Sample transaction data - these are common examples that should work well
    const sampleTransactions = [
      {
        uid: "test_user_1",
        accountid: "account123",
        amountnum: 42.99,
        date: "2023-01-15",
        original_description: "NETFLIX MONTHLY SUBSCRIPTION",
        transactionid: "tx_" + Date.now() + "_1",
        accountType: "creditCard",
        settlement: "debit"
      },
      {
        uid: "test_user_1",
        accountid: "account123",
        amountnum: 85.43,
        date: "2023-01-16",
        original_description: "AMAZON.COM PURCHASE",
        transactionid: "tx_" + Date.now() + "_2",
        accountType: "creditCard",
        settlement: "debit"
      },
      {
        uid: "test_user_1",
        accountid: "account123",
        amountnum: 22.50,
        date: "2023-01-17",
        original_description: "STARBUCKS COFFEE #4321",
        transactionid: "tx_" + Date.now() + "_3",
        accountType: "creditCard",
        settlement: "debit"
      },
      {
        uid: "test_user_1",
        accountid: "account123",
        amountnum: 1200.00,
        date: "2023-01-20",
        original_description: "DIRECT DEPOSIT - ACME CORP PAYROLL",
        transactionid: "tx_" + Date.now() + "_4",
        accountType: "checking",
        settlement: "credit"
      }
    ];
    
    // Send transactions to the sync endpoint for immediate enrichment
    console.log('Sending sample transactions for enrichment...');
    
    const response = await axios.post(
      `${baseUrl}/cleanup/sync`,
      { transactions: sampleTransactions },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    console.log('\n✅ Enrichment successful!');
    
    // Save the response to a file for inspection
    const outputDir = path.resolve(process.cwd(), 'scripts/output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.resolve(outputDir, 'fingoal-enrichment-result.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(response.data, null, 2)
    );
    
    console.log(`Full response saved to: ${outputPath}`);
    
    // Display enrichment summary
    console.log('\nEnrichment Summary:');
    
    const { enrichedTransactions } = response.data;
    
    if (enrichedTransactions && enrichedTransactions.enriched) {
      console.log(`Successfully enriched: ${enrichedTransactions.enriched.length} transactions`);
      
      // Display some examples of the enriched data
      enrichedTransactions.enriched.forEach((tx: any, index: number) => {
        console.log(`\nTransaction ${index + 1}:`);
        console.log(`  Original: ${tx.original_description}`);
        console.log(`  Enriched: ${tx.simple_description}`);
        console.log(`  Category: ${tx.category}`);
        console.log(`  Merchant: ${tx.merchant_name}`);
        if (tx.tags && tx.tags.length > 0) {
          console.log(`  Tags: ${tx.tags.join(', ')}`);
        }
      });
    }
    
    if (enrichedTransactions && enrichedTransactions.failed && enrichedTransactions.failed.length > 0) {
      console.log(`\nFailed to enrich: ${enrichedTransactions.failed.length} transactions`);
      console.log('Failed transactions:', enrichedTransactions.failed);
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('\n❌ Transaction enrichment failed!');
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error);
    }
    
    return { success: false };
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Authenticate and get token
    const token = await authenticate();
    
    // Test transaction enrichment
    await testTransactionEnrichment(token);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the test
main(); 