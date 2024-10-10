"use client";

import { saveAccountYodlee, saveTransactionsYodlee } from "@/utils/yodlee-api";
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
  const [openModal, setOpenModal] = useState(false);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkReady, setIsLinkReady] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const createAccessToken = async () => {
      try {
        const { data } = await axiosYodleeInternal(
          "/api/yodlee/create-access-token"
        );
        setAccessToken(data.accessToken);
        setIsLinkReady(true);
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error creating link token", error);
      }
    };
    if (user?.is_connected_bank === false && user.selected_country === "AU") {
      createAccessToken();
    }
  }, [user?.is_connected_bank]);

  const fetchTransactions = async (token: string, accountIds: string) => {
    try {
      const { data } = await axiosInternal("/api/yodlee/transactions", {
        params: {
          accessToken: token,
          accountIds,
        },
      });
      console.log(data, "data");
      if (user?.id) {
        await saveTransactionsYodlee(data.transactions, user.id);
      }
      setTransactions(data.transactions);
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching transactions: ${getErrorMessage(error)}`);
    }
  };

  const fetchAccounts = async (
    token: string,
    providerAccountId: string,
    requestId: string
  ) => {
    try {
      const { data } = await axiosInternal("/api/yodlee/accounts", {
        params: {
          accessToken: token,
          providerAccountId,
          requestId,
        },
      });
      if (user?.id) {
        await saveAccountYodlee(data.accounts, user.id);
      }
      return data.accounts;
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching accounts: ${getErrorMessage(error)}`);
    }
  };

  const onSuccess = async (data: any) => {
    setIsLoading(true);
    if (accessToken) {
      const accounts = await fetchAccounts(
        accessToken,
        data.providerAccountId,
        data.requestId
      );
      const accountIds = accounts.map((item: any) => item.id).join();
      await fetchTransactions(accessToken, accountIds);
    }
    setIsLoading(false);
  };

  const handleOpenYodlee = useCallback(async () => {
    try {
      setOpenModal(true);
      await loadYodleeFastLinkScript();
      if (!window.fastlink) {
        throw new Error("FastLink script not loaded properly");
      }
      window.fastlink.open(
        {
          fastLinkURL: process.env.NEXT_PUBLIC_YODLEE_FASTLINK_URL,
          accessToken: `Bearer ${accessToken}`,
          params: {
            configName: "Verification",
          },
          onSuccess,
          onClose: () => {
            setOpenModal(false);
          },
        },
        "container-fastlink"
      );
    } catch (error) {
      console.error("Error loading FastLink script:", error);
    }
  }, [accessToken, onSuccess]);

  return {
    transactions,
    open: handleOpenYodlee,
    isLinkReady: isLinkReady,
    isAlreadyConnected: user?.is_connected_bank,
    openModal,
    isLoading,
  };
};

export { useYodlee };
