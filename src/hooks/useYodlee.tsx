"use client";

import { saveTransactionsYodlee } from "@/utils/yodlee-api";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/utils/helpers";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useUser } from "./useUser";
import { useAppDispatch } from "@/lib/store/hooks";
import { axiosYodleeInternal } from "@/utils/yodlee-api";
import { axiosInternal } from "@/utils/axios";

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

const useYodlee = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const { data } = await axiosYodleeInternal(
          "/api/yodlee/create-access-token"
        );
        setAccessToken(data.accessToken);
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error creating link token", error);
      }
    };
    createLinkToken();
  }, []);

  const fetchTransactions = async (token: string, accountId: string) => {
    try {
      const { data } = await axiosInternal("/api/yodlee/transactions", {
        params: {
          accessToken: token,
          accountId,
        },
      });
      console.log(data, "data");
      if (user?.id) {
        await saveTransactionsYodlee(data.transactions, user.id);
      }
      setTransactions(transactions);
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching transactions: ${getErrorMessage(error)}`);
    }
  };

  const onSuccess = async (data: any) => {
    if (accessToken) {
      await fetchTransactions(accessToken, data.provideAccountId);
    }
  };

  const handleOpenYodlee = useCallback(async () => {
    try {
      await loadYodleeFastLinkScript();

      if (!window.fastlink) {
        throw new Error("FastLink script not loaded properly");
      }

      window.fastlink.open(
        {
          fastLinkURL:
            "https://fl4.sandbox.yodlee.com/authenticate/restserver/fastlink",
          accessToken: `Bearer ${accessToken}`,
          params: {
            configName: "Verification",
          },
          onSuccess,
        },
        "container-fastlink"
      );
    } catch (error) {
      console.error("Error loading FastLink script:", error);
    }
  }, []);

  return {
    transactions,
    openYodleeLik: handleOpenYodlee,
    isLoading,
  };
};

export { useYodlee };
