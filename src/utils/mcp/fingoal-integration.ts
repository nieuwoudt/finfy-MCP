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

/**
 * API client for interacting with FinGoal services
 */
export class FingoalClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private isProduction: boolean;

  constructor(
    clientId: string,
    clientSecret: string,
    isProduction: boolean = false
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.isProduction = isProduction;
    this.baseUrl = isProduction
      ? "https://findmoney.fingoal.com/v3"
      : "https://findmoney-dev.fingoal.com/v3";
  }

  /**
   * Check if this client is properly configured
   */
  isConfigured(): boolean {
    return !!this.clientId && !!this.clientSecret;
  }

  /**
   * Get or refresh the access token
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpiry) {
      return this.accessToken;
    }

    // Refresh the token
    try {
      if (typeof window !== 'undefined') {
        console.warn("FinGoal auth can only be performed server-side");
        throw new Error("Cannot authenticate with FinGoal in browser environment");
      }
      
      const response = await axios.post(
        `${this.baseUrl}/auth/token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "client_credentials",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Token expires in X seconds, we'll subtract 60 seconds to be safe
      this.tokenExpiry = now + (response.data.expires_in - 60) * 1000;

      return this.accessToken;
    } catch (error) {
      console.error("Error getting FinGoal access token:", error);
      throw error;
    }
  }

  /**
   * Get user financial tags from FinGoal
   */
  async getUserTags(userId: string): Promise<any> {
    // For browser safety
    if (typeof window !== 'undefined') {
      console.warn("FinGoal API can only be called server-side");
      return { user: { tags: [] } };
    }
    
    try {
      // Get access token
      const token = await this.getAccessToken();

      // Call the user API
      const response = await axios.get(`${this.baseUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error getting user tags:", error);
      throw error;
    }
  }

  /**
   * Enrich transactions with FinGoal AI
   */
  async enrichTransactions(transactions: any[]): Promise<any> {
    // For browser safety
    if (typeof window !== 'undefined') {
      console.warn("FinGoal API can only be called server-side");
      return { status: { batch_request_id: "browser-mock" } };
    }
    
    try {
      // Get access token
      const token = await this.getAccessToken();

      // Call the batch API
      const response = await axios.post(
        `${this.baseUrl}/batch`,
        {
          transactions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error enriching transactions:", error);
      throw error;
    }
  }

  /**
   * Get transaction enrichment results for a batch
   */
  async getBatchResults(batchId: string): Promise<any> {
    // For browser safety
    if (typeof window !== 'undefined') {
      console.warn("FinGoal API can only be called server-side");
      return { transactions: [] };
    }
    
    try {
      // Get access token
      const token = await this.getAccessToken();

      // Call the batch results API
      const response = await axios.get(`${this.baseUrl}/batch/${batchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error getting batch results:", error);
      throw error;
    }
  }
} 