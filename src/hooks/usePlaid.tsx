"use client";

import { saveTransactionsAndAccounts } from "@/lib/supabase/actions";
import { getErrorMessage } from "@/utils/helpers";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { usePlaidLink } from "react-plaid-link";

const usePlaid = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch("/api/plaid/create-link-token");

        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Error creating link token", error);
      }
    };
    createLinkToken();
  }, []);

  const exchangePublicToken = async (publicToken: string) => {
    try {
      const response = await fetch("/api/plaid/exchange-public-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_token: publicToken }),
      });
      const { access_token } = await response.json();
      setAccessToken(access_token);
      return access_token;
    } catch (error) {
      toast.error(`Error exchanging public token: ${getErrorMessage(error)}`);
    }
  };

  const fetchTransactions = async (token: string) => {
    try {
      const response = await fetch("/api/plaid/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      });
      const { transactions } = await response.json();
      await saveTransactionsAndAccounts(transactions);
      setTransactions(transactions);
    } catch (error) {
      toast.error(`Error fetching transactions: ${getErrorMessage(error)}`);
    }
  };

  const onSuccess = useCallback(async (publicToken: string) => {
    setIsLoading(true);
    const token = await exchangePublicToken(publicToken);
    if (token) {
      await fetchTransactions(token);
    }
    setIsLoading(false);
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return {
    openPlaidLink: open,
    isPlaidLinkReady: ready,
    transactions,
    isLoading,
  };
};

export { usePlaid };
