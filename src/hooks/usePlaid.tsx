"use client";

import {
  saveTransactionsAndAccounts,
  saveBalances,
  saveInvestmentTransactions,
  saveLiabilities,
  saveBankIncome,
  saveAccounts,
} from "@/lib/supabase/actions";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/utils/helpers";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { usePlaidLink } from "react-plaid-link";
import { useUser } from "./useUser";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateUser } from "@/lib/store/features/user/userSlice";
import { IdentityGetResponseExtended } from "@/types";
import { Institution } from "plaid";

const usePlaid = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const dispatch = useAppDispatch();
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
        Sentry.captureException(error);
        console.error("Error creating link token", error);
      }
    };
    if (user?.is_connected_bank === false && user.selected_country !== "ZA") {
      createLinkToken();
    }
  }, [user?.is_connected_bank]);

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
      Sentry.captureException(error);
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
      Sentry.captureException(error);
      toast.error(`Error fetching transactions: ${getErrorMessage(error)}`);
    }
  };

  const fetchUserIdentity = async (token: string) => {
    try {
      const identity = await fetchIdentityData(token);
      if (!identity) return;

      const institutionId = identity?.item?.institution_id;
      const institutionData = institutionId ? await fetchUserInstitution(institutionId) : undefined;
  
      if (user?.id) {
        await saveAccounts(identity, user.id, institutionData);
      }
  
      return identity;
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching identity: ${getErrorMessage(error)}`);
    }
  };

  const fetchIdentityData = async (token: string): Promise<IdentityGetResponseExtended | null> => {
    const response = await fetch("/api/plaid/identity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: token }),
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch identity: ${response.statusText}`);
    }
  
    const { identity } = await response.json();

    return identity;
  };

  const fetchUserItems = async () => {
    try {
      const userToken = user?.plaid_user_token;
      const response = await fetch("/api/plaid/user-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_token: userToken }),
      });
      const { items } = await response.json();
      
      return items;
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching items: ${getErrorMessage(error)}`);
    }
  };

  const fetchUserInstitution = async (institutionID: string): Promise<Institution | undefined> => {
      const response = await fetch("/api/plaid/institution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institutionID }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch institution: ${response.statusText}`);
      }

      const { institution } = await response.json();
      
      return institution;
  };

  const fetchBalances = async (token: string) => {
    try {
      const response = await fetch("/api/plaid/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      });
      const { balances } = await response.json();

      if (user?.id) {
        await saveBalances(balances, user?.id);
      }
      setBalances(balances);
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching balances: ${getErrorMessage(error)}`);
    }
  };

  const fetchIncome = async (userToken: string) => {
    try {
      const response = await fetch("/api/plaid/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_token: userToken }),
      });
      const { income } = await response.json();
      console.log(income, "income");

      if (user?.id) {
        await saveBankIncome(income, user.id);
      }
      setIncome(income);
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching income: ${getErrorMessage(error)}`);
    }
  };

  const fetchInvestments = async (token: string) => {
    try {
      const response = await fetch("/api/plaid/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      });
      const data = await response.json();
      if (user?.id) {
        await saveInvestmentTransactions(data.investments, user?.id);
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching income: ${getErrorMessage(error)}`);
    }
  };

  const fetchLiabilities = async (token: string) => {
    try {
      const response = await fetch("/api/plaid/liabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      });
      const data = await response.json();
      if (user?.id) {
        await saveLiabilities(data.liabilities, user?.id);
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching income: ${getErrorMessage(error)}`);
    }
  };

  // Creating a new user to obtain a `user_token` from Plaid.
  // This `user_token` is not associated with the current session or user authentication.
  // It is required for long-term access to financial data through the Plaid API, such as income or assets.
  const fetchCreateUser = async () => {
    try {
      const response = await fetch("/api/plaid/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, phone: user?.phone }),
      });
      const data = await response.json();
      dispatch(
        updateUser({
          plaid_user_token: data.user_token,
        })
      );
      return data.user_token;
    } catch (error) {}
  };

  const onSuccess = useCallback(
    async (publicToken: string) => {
      setIsLoading(true);
      const token = await exchangePublicToken(publicToken);
      if (token) {
        await dispatch(
          updateUser({
            plaid_access_token: token,
          })
        );
        await fetchUserIdentity(token);
        await fetchTransactions(token);
        await fetchInvestments(token);
        await fetchLiabilities(token);
        await fetchBalances(token);
        let userToken = user?.plaid_user_token;
        if (!userToken) {
          userToken = await fetchCreateUser();
        }
        await fetchIncome(userToken as string);
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
    open,
    isLinkReady: ready,
    accessToken,
    transactions,
    assets,
    balances,
    income,
    isLoading,
    isAlreadyConnected: user?.is_connected_bank,
  };
};

export { usePlaid };
