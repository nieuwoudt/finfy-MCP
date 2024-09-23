"use client";

import {
  saveTransactionsAndAccounts,
  saveBalances,
} from "@/lib/supabase/actions";
import { getErrorMessage } from "@/utils/helpers";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { usePlaidLink } from "react-plaid-link";
import { useUser } from "./useUser";

const usePlaid = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [income, setIncome] = useState<any[]>([]);

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
      if (user?.id) {
        await saveTransactionsAndAccounts(transactions, user.id);
      }
      setTransactions(transactions);
    } catch (error) {
      toast.error(`Error fetching transactions: ${getErrorMessage(error)}`);
    }
  };

  const fetchAssets = async (token: string) => {
    try {
      const response = await fetch("/api/plaid/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      });
      const { assets } = await response.json();
      console.log(assets, "assets");
      // if (user?.id) {
      //   await saveAssets(assets, user.id);
      // }
      setAssets(assets);
    } catch (error) {
      toast.error(`Error fetching assets: ${getErrorMessage(error)}`);
    }
  };

  const fetchBalances = async (token: string) => {
    try {
      const response = await fetch("/api/plaid/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      });
      const { balances } = await response.json();
      console.log(balances, "balances");
      if (user?.id) {
        await saveBalances(balances, user?.id);
      }
      setBalances(balances);
    } catch (error) {
      toast.error(`Error fetching balances: ${getErrorMessage(error)}`);
    }
  };

  const fetchIncome = async (token: string) => {
    try {
      const response = await fetch("/api/plaid/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      });
      const { income } = await response.json();
      console.log(income, "income");

      // if (user?.id) {
      //   await saveIncome(income, user.id);
      // }
      setIncome(income);
    } catch (error) {
      toast.error(`Error fetching income: ${getErrorMessage(error)}`);
    }
  };

  const onSuccess = useCallback(
    async (publicToken: string) => {
      setIsLoading(true);
      const token = await exchangePublicToken(publicToken);
      if (token) {
        await fetchTransactions(token);
        // await fetchAssets(token);
        await fetchBalances(token);
        // await fetchIncome(token);
      }
      setIsLoading(false);
    },
    [user?.id]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return {
    openPlaidLink: open,
    isPlaidLinkReady: ready,
    transactions,
    assets,
    balances,
    income,
    isLoading,
  };
};

export { usePlaid };
