"use client";

import { useEffect, useState, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";

const usePlaid = () => {
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
      console.error("Error exchanging public token", error);
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
      setTransactions(transactions);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  const onSuccess = useCallback(async (publicToken: string) => {
    const token = await exchangePublicToken(publicToken);
    if (token) {
      fetchTransactions(token);
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });
  console.log(linkToken, ready);
  return {
    openPlaidLink: open,
    isPlaidLinkReady: ready,
    transactions,
  };
};

export { usePlaid };
