/**
 * Fingoal Integration for MCP
 * 
 * This file contains the Fingoal API integration for enriching financial data.
 */

import { supabase } from "@/lib/supabase/client";
import axios from "axios";
import crypto from "crypto";

/**
 * User tag interface from Fingoal
 */
export interface UserTag {
  id: string;
  user_id: string;
  tag_name: string;
  tag_definition?: string;
  group?: string;
  use_cases?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Transaction tag interface from Fingoal
 */
export interface TransactionTag {
  id: string;
  transaction_id: string;
  category?: string;
  subcategory?: string;
  description?: string;
  confidence_score?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch user tags from Fingoal
 */
export async function fetchUserTags(userId: string): Promise<UserTag[]> {
  try {
    // Initialize the Fingoal client
    const client = new FingoalClient(
      process.env.FINGOAL_CLIENT_ID || "",
      process.env.FINGOAL_CLIENT_SECRET || "",
      process.env.NODE_ENV === "production"
    );
    
    // Fetch user tags from Fingoal
    const userTags = await client.getUserTags(userId);
    
    // Return the user tags
    return userTags.user.tags.map(tag => ({
      id: tag.id,
      user_id: userId,
      tag_name: tag.name,
      tag_definition: tag.tag_description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching user tags:", error);
    
    // Fall back to Supabase if Fingoal API call fails
    const { data, error: dbError } = await supabase
      .from("user_tags")
      .select("*")
      .eq("user_id", userId);
      
    if (dbError) throw dbError;
    return data || [];
  }
}

/**
 * Fetch transaction tags from Fingoal
 */
export async function fetchTransactionTags(transactionIds: string[]): Promise<Record<string, TransactionTag[]>> {
  try {
    if (transactionIds.length === 0) return {};
    
    // Get transaction tags from Supabase as the Fingoal API doesn't provide a direct method
    // to fetch tags for specific transactions. They come with the enriched transactions.
    const { data, error } = await supabase
      .from("transaction_tags")
      .select("*")
      .in("transaction_id", transactionIds);
      
    if (error) throw error;
    
    // Group by transaction ID
    const tagsByTransaction: Record<string, TransactionTag[]> = {};
    (data || []).forEach(tag => {
      if (!tagsByTransaction[tag.transaction_id]) {
        tagsByTransaction[tag.transaction_id] = [];
      }
      tagsByTransaction[tag.transaction_id].push(tag);
    });
    
    return tagsByTransaction;
  } catch (error) {
    console.error("Error fetching transaction tags:", error);
    return {};
  }
}

/**
 * Enrich transactions with Fingoal data
 * This will combine transactions with their associated tags
 */
export async function enrichTransactions(userId: string, transactions: any[]) {
  try {
    // Initialize the Fingoal client
    const client = new FingoalClient(
      process.env.FINGOAL_CLIENT_ID || "",
      process.env.FINGOAL_CLIENT_SECRET || "",
      process.env.NODE_ENV === "production"
    );
    
    // Format transactions for Fingoal
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
    
    // Submit transactions for enrichment
    const enrichmentResponse = await client.enrichTransactions(fingoalTransactions);
    
    // Store the batch request ID for later retrieval
    const { error } = await supabase
      .from("enrichment_batches")
      .insert({
        batch_id: enrichmentResponse.status.batch_request_id,
        status: "processing",
        transaction_count: transactions.length,
        created_at: new Date().toISOString()
      });
      
    if (error) {
      console.error("Error storing batch ID:", error);
    }
    
    // Return the original transactions as we'll get the enriched ones via webhook
    return transactions;
  } catch (error) {
    console.error("Error enriching transactions:", error);
    
    // Extract transaction IDs
    const transactionIds = transactions.map(t => t.transaction_id).filter(Boolean);
    
    // Fetch transaction tags
    const transactionTags = await fetchTransactionTags(transactionIds);
    
    // Combine transactions with their tags
    return transactions.map(transaction => {
      const tags = transactionTags[transaction.transaction_id] || [];
      return {
        ...transaction,
        tags
      };
    });
  }
}

interface FingoalAuthResponse {
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}

interface FingoalTransaction {
  uid: string;
  accountid: string;
  amountnum: number;
  date: string;
  original_description: string;
  transactionid: string;
  accountType: string;
  settlement: string;
}

interface FingoalEnrichmentResponse {
  status: {
    transactions_received: boolean;
    transactions_validated: boolean;
    processing: boolean;
    num_transactions_processing: number;
    batch_request_id: string;
  };
}

interface FingoalUserTags {
  user: {
    client_id: string;
    id: string;
    uid: string;
    uniqueId: string;
    lifetimeSavings: number;
    registrationDate: string;
    subtenantId: string;
    tags: Array<{
      id: string;
      name: string;
      confidence: number;
      tag_type: string;
      tag_description: string;
    }>;
    totaltransactions: number;
    transactionsSinceLastUpdate: number;
  };
  transactions: any[];
}

export class FingoalClient {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private baseUrl: string;

  constructor(clientId: string, clientSecret: string, isProduction: boolean = false) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = isProduction 
      ? "https://findmoney.fingoal.com/v3"
      : "https://findmoney-dev.fingoal.com/v3";
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post<FingoalAuthResponse>(
        `${this.baseUrl}/authentication`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      console.error("Error getting Fingoal access token:", error);
      throw error;
    }
  }

  /**
   * Enrich transactions using the streaming endpoint
   */
  async enrichTransactions(transactions: FingoalTransaction[]): Promise<FingoalEnrichmentResponse> {
    try {
      const token = await this.getAccessToken();
      const response = await axios.post<FingoalEnrichmentResponse>(
        `${this.baseUrl}/cleanup/streaming`,
        { transactions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error enriching transactions:", error);
      throw error;
    }
  }

  /**
   * Get user tags and transaction data
   */
  async getUserTags(userId: string): Promise<FingoalUserTags> {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get<FingoalUserTags>(
        `${this.baseUrl}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting user tags:", error);
      throw error;
    }
  }

  /**
   * Trigger a sync of user tags
   */
  async syncUserTags(userId: string): Promise<FingoalUserTags> {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get<FingoalUserTags>(
        `${this.baseUrl}/users/${userId}/sync`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error syncing user tags:", error);
      throw error;
    }
  }
  
  /**
   * Retrieve enriched transactions from a batch
   */
  async retrieveEnrichedTransactions(batchRequestId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(
        `${this.baseUrl}/cleanup/${batchRequestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error retrieving enriched transactions:", error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const hmac = crypto.createHmac("sha256", this.clientSecret);
      const digest = hmac.update(payload).digest("hex");
      return digest === signature;
    } catch (error) {
      console.error("Error verifying webhook signature:", error);
      return false;
    }
  }
} 