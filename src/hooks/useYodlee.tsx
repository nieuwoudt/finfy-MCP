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
import { updateUser } from "@/lib/store/features/user/userSlice";

// Import dynamically only when needed (avoid import errors)
// We'll handle MCP separately on server side

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
  const [isFinishConnection, setIsFinishConnection] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const createAccessToken = async () => {
      try {
        const { data } = await axiosYodleeInternal(
          "/api/yodlee/create-access-token"
        );
        setAccessToken(data.accessToken)
        console.log("accessToken:", data.accessToken)
        setIsLinkReady(true);
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error creating link token", error);
      }
    };
    if (user?.is_connected_bank === false && user?.selected_country === "ZA") {
      createAccessToken();
    }
  }, [user?.is_connected_bank, user?.selected_country]);

  const fetchTransactions = async (token: string, accountIds: string) => {
    try {
      const { data } = await axiosInternal("/api/yodlee/transactions", {
        params: {
          accessToken: token,
          accountIds,
        },
      });
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
    requestId: string,
    providerId: string,
  ) => {
    try {
      const [accountsResponse, providerResponse] = await Promise.all([
        axiosInternal("/api/yodlee/accounts", {
          params: {
            accessToken: token,
            providerAccountId,
            requestId,
          },
        }),
        axiosInternal("/api/yodlee/providers", {
          params: {
            accessToken: token,
            providerId,
          },
        }),
      ]);

      const accounts = accountsResponse.data;
      const provider = providerResponse.data;

      if (user?.id) {
        await saveAccountYodlee(accounts.accounts, user.id, provider.provider[0]);
        await dispatch(
          updateUser({
            is_connected_bank: true,
          })
        );
      }
      return accounts.accounts;
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching accounts: ${getErrorMessage(error)}`);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSuccess = async (data: any) => {
    try {
      setIsLoading(true);
      if (accessToken) {
        const accounts = await fetchAccounts(
          accessToken,
          data.providerAccountId,
          data.requestId,
          data.providerId
        );
        const accountIds = accounts.map((item: any) => item.id).join();
        await fetchTransactions(accessToken, accountIds);
      }
      setIsLoading(false);
    } catch {
      setIsFinishConnection(true)
    } finally {
      setIsFinishConnection(true)
    }

  };

  const handleOpenYodlee = useCallback(async () => {
    try {
      await loadYodleeFastLinkScript();
      if (!window.fastlink) {
        throw new Error("FastLink script not loaded properly");
      }
      let container = document.getElementById("container-fastlink");
      if (!container) {
        container = document.createElement("div");
        container.id = "container-fastlink";
        Object.assign(container.style, {
          position: "fixed",
          padding: "20px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "max-content",
          height: "max-content",
          maxHeight: "80%",
          maxWidth: "750px",
          minHeight: "300px",
          backgroundColor: "#fff",
          zIndex: "1000",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          borderRadius: "8px",
          overflow: "auto",
        });

        document.body.appendChild(container);

        const overlay = document.createElement("div");
        overlay.id = "modal-overlay";
        Object.assign(overlay.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: "999",
        });
        overlay.onclick = () => {
          if (container) {
            container.remove();
            overlay.remove();
          }
        };
        document.body.appendChild(overlay);
      }

      window.fastlink.open(
        {
          fastLinkURL: process.env.NEXT_PUBLIC_YODLEE_FASTLINK_URL,
          accessToken: `Bearer ${accessToken}`,
          params: {
            configName: "LiveConfiguration",
            // configName: "Verification",
          },
          onSuccess,
          onClose: () => {
            let container = document.getElementById("container-fastlink");
            setOpenModal(false);
            if (container) {
              container.remove();
            }
            let overlay = document.getElementById("modal-overlay");
            if (overlay) {
              overlay.remove();
            }
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
    isFinishConnection
  };
};

export { useYodlee };
