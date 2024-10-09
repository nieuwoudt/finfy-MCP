"use client";

import {
  saveTransactionsAndAccounts,
  saveBalances,
  saveInvestmentTransactions,
  saveLiabilities,
  saveBankIncome,
  saveAssetReport,
} from "@/lib/supabase/actions";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/utils/helpers";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { usePlaidLink } from "react-plaid-link";
import { useUser } from "./useUser";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateUser } from "@/lib/store/features/user/userSlice";
import axios from "axios";

declare global {
  interface Window {
    fastlink: any;
  }
}

const loadYodleeFastLinkScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.fastlink) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.yodlee.com/fastlink/v4/initialize.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load FastLink script"));

    document.body.appendChild(script);
  });
};

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

  const isPlaid = false; // TODO implement filter country

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch(
          isPlaid
            ? "/api/plaid/create-link-token"
            : "/api/yodlee/create-link-token"
        );
        const data = await response.json();
        setLinkToken(data.link_token);
        console.log("Link token created successfully");
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error creating link token", error);
      }
    };
    createLinkToken();
  }, [isPlaid]);

  const exchangePublicToken = async (publicToken: string) => {
    try {
      const response = await fetch(
        isPlaid
          ? "/api/plaid/exchange-public-token"
          : "/api/yodlee/exchange-public-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token: publicToken }),
        }
      );
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
      const response = await fetch(
        isPlaid ? "/api/plaid/transactions" : "/api/yodlee/transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: token }),
        }
      );
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

  const fetchBalances = async (token: string) => {
    try {
      const response = await fetch(
        isPlaid ? "/api/plaid/balance" : "/api/yodlee/balance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: token }),
        }
      );
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
      const response = await fetch(
        isPlaid ? "/api/plaid/income" : "/api/yodlee/income",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_token: userToken }),
        }
      );
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
      const response = await fetch(
        isPlaid ? "/api/plaid/investments" : "/api/yodlee/investments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: token }),
        }
      );
      const data = await response.json();
      if (user?.id) {
        await saveInvestmentTransactions(data.investments, user?.id);
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching investments: ${getErrorMessage(error)}`);
    }
  };

  const fetchLiabilities = async (token: string) => {
    try {
      const response = await fetch(
        isPlaid ? "/api/plaid/liabilities" : "/api/yodlee/liabilities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: token }),
        }
      );
      const data = await response.json();
      if (user?.id) {
        await saveLiabilities(data.liabilities, user?.id);
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching liabilities: ${getErrorMessage(error)}`);
    }
  };

  // Creating a new user to obtain a `user_token` from Plaid or Yodlee.
  const fetchCreateUser = async () => {
    try {
      const response = await fetch(
        isPlaid ? "/api/plaid/create-user" : "/api/yodlee/create-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user?.email, phone: user?.phone }),
        }
      );
      const data = await response.json();
      dispatch(
        updateUser({
          plaid_user_token: data.user_token,
        })
      );
      return data.user_token;
    } catch (error) {
      Sentry.captureException(error);
    }
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
    [user?.id, isPlaid]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  const openPlaidLink = useCallback(async () => {
    if (isPlaid) {
      open(); // Plaid opening
    } else {
      try {
        console.log("linkToken", linkToken);
        await loadYodleeFastLinkScript();

        if (!window.fastlink) {
          throw new Error("FastLink script not loaded properly");
        }

        window.fastlink.open(
          {
            fastLinkURL:
              "https://fl4.sandbox.yodlee.com/authenticate/restserver/fastlink",
            accessToken: `Bearer ${linkToken}`,
            params: {
              configName: "Verification",
              // providerId : 16441,
              // flow: 'add',
            },
            onSuccess: async (data: any) => {
              console.log("FastLink Success:", data);
              const response = await axios("/api/yodlee/transactions", {
                params: {
                  accessToken: linkToken,
                  accountId: data.provideAccountId,
                },
              });

              console.log(response, "response");
              // onSuccess(data.public_token);
            },
            onError: (error: any) => {
              console.error("FastLink Error:", error);
            },
            onClose: () => {
              console.log("FastLink Closed");
            },
          },
          "container-fastlink"
        );
      } catch (error) {
        console.error("Error loading FastLink script:", error);
      }
    }
  }, [isPlaid, open, linkToken, onSuccess]);

  return {
    openPlaidLink,
    isPlaidLinkReady: ready,
    accessToken,
    transactions,
    assets,
    balances,
    income,
    isLoading,
  };
};

export { usePlaid };
