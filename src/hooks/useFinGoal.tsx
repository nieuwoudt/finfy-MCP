"use client";

import { useState, useCallback } from "react";
import { useUser } from "./useUser";
import * as Sentry from "@sentry/nextjs";
import toast from "react-hot-toast";
import { FinGoalSavingsRecommendation } from "@/types/fingoal";

export const useFinGoal = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [savingsRecommendations, setSavingsRecommendations] = useState<FinGoalSavingsRecommendation[]>([]);
  const [userTags, setUserTags] = useState<any[]>([]);
  const [transactionTags, setTransactionTags] = useState<any[]>([]);
  
  /**
   * Enrich transactions with FinGoal
   */
  const enrichTransactions = useCallback(async (transactions: any[]) => {
    if (!user?.id) {
      toast.error("User ID not found");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/fingoal/enrich-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactions }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to enrich transactions");
      }
      
      const data = await response.json();
      
      if (data.status?.batch_request_id) {
        toast.success("Transactions sent for enrichment");
        return data.status.batch_request_id;
      }
      
      return null;
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to enrich transactions");
      console.error("Error enriching transactions:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  /**
   * Get enriched transactions by batch ID
   */
  const getEnrichedTransactions = useCallback(async (batchId: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/fingoal/enriched-transactions/${batchId}`);
      
      if (!response.ok) {
        throw new Error("Failed to get enriched transactions");
      }
      
      const data = await response.json();
      
      setTransactionTags(data.enrichedTransactions?.flatMap((t: any) => 
        t.tags?.map((tag: string) => ({ transaction_id: t.transaction_id, tag })) || []
      ));
      
      return data.enrichedTransactions;
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to get enriched transactions");
      console.error("Error getting enriched transactions:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Get user tags
   */
  const getUserTags = useCallback(async (sync = false) => {
    if (!user?.id) {
      toast.error("User ID not found");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/fingoal/user-tags/${user.id}?sync=${sync}`);
      
      if (!response.ok) {
        throw new Error("Failed to get user tags");
      }
      
      const data = await response.json();
      
      if (data.user?.tags) {
        setUserTags(data.user.tags);
        return data.user.tags;
      }
      
      return [];
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to get user tags");
      console.error("Error getting user tags:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  /**
   * Get savings recommendations
   */
  const getSavingsRecommendations = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/fingoal/savings-recommendations`);
      
      if (!response.ok) {
        throw new Error("Failed to get savings recommendations");
      }
      
      const data = await response.json();
      
      if (data.finsights) {
        setSavingsRecommendations(data.finsights);
        return data.finsights;
      }
      
      return [];
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to get savings recommendations");
      console.error("Error getting savings recommendations:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Submit transactions for savings recommendations
   */
  const submitTransactionsForSavingsRecommendations = useCallback(async (transactions: any[], type: 'fingoal' | 'plaid' | 'mx' = 'fingoal') => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/fingoal/savings-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactions, type }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit transactions for savings recommendations");
      }
      
      toast.success("Transactions submitted for savings recommendations");
      
      return true;
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to submit transactions for savings recommendations");
      console.error("Error submitting transactions for savings recommendations:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    isLoading,
    savingsRecommendations,
    userTags,
    transactionTags,
    enrichTransactions,
    getEnrichedTransactions,
    getUserTags,
    getSavingsRecommendations,
    submitTransactionsForSavingsRecommendations,
  };
}; 