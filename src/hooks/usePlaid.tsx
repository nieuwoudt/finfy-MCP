"use client";

import {
  saveTransactionsAndAccounts,
  saveBalances,
  saveInvestmentTransactions,
  saveLiabilities,
  saveBankIncome,
  saveAccounts,
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
import { IdentityGetResponseExtended } from "@/types";
import { Institution } from "plaid";
import axios from "axios";

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
    createLinkToken();
  }, []);

  useEffect(() => {
    const fetchAndSaveIncome = async () => {
      if (user?.id) {
        dispatch(
          updateUser({
            last_update: new Date().toISOString(),
          })
        );
      }
      try {
        const response = await fetch("/api/plaid/income", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_token: user?.plaid_user_token }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch income: ${response.statusText}`);
        }

        const { income } = await response.json();
        if (user?.id) {
          await saveBankIncome(income, user.id);
        };

      } catch (error) {
        console.error("Error fetching or saving income:", error);
      }
    };

    const reUp = async () => {
      try {

        const today = new Date().toISOString().split("T")[0];
        const lastUpdateDate = user?.last_update
          ? new Date(user.last_update).toISOString().split("T")[0]
          : null;


        if (user?.is_connected_bank && user?.plaid_user_token && lastUpdateDate !== today) {
          try {
            fetchAndSaveIncome(); //bank_income
          } catch (err) {
            console.log("bank_income", { err })
          }
          if (user?.is_connected_bank && user?.plaid_access_token && lastUpdateDate !== today) {
            if (user?.id) {
              dispatch(
                updateUser({
                  last_update: new Date().toISOString(),
                })
              );
            }
            try {
              fetchTransactions(user?.plaid_access_token); //bank_transactions
            } catch (err) {
              console.log("bank_transactions", { err })
            };
            try {
              fetchInvestments(user?.plaid_access_token); //investment_transactions
            } catch (err) {
              console.log("investment_transactions", { err })
            };
            try {
              // fetchLiabilities(user?.plaid_access_token); //liabilities TODO hide Liabilities bank_liabilities
            } catch (err) {
              console.log("bank_liabilities", { err })
            };
            try {
              fetchBalances(user?.plaid_access_token); //bank_balances
            } catch (err) {
              console.log("bank_balances", { err })
            };
            try {
              fetchAndSaveAssets(user?.plaid_access_token); //asset_reports
            } catch (err) {
              console.log("asset_reports", { err })
            };
          }
        }

      } catch (err) {
        console.log("all_delly_upd_err", { err })

      } finally {
        const apiPayload = {
          user_id: `${user?.id}`,
          provider: "plaid",
        };
        const apiResponse = await axios.post(
          "https://finify-ai-137495399237.us-central1.run.app/insert_data",
          apiPayload
        );
      }
    }
    const today = new Date().toISOString().split("T")[0];
    const lastUpdateDate = user?.last_update
      ? new Date(user.last_update).toISOString().split("T")[0]
      : null;
    if (lastUpdateDate !== today) {
      reUp();
    }
  }, [user, dispatch]);




  const exchangePublicToken = async (publicToken: string) => {
    try {
      const response = await fetch("/api/plaid/exchange-public-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_token: publicToken }),
      });
      const { access_token, item_id } = await response.json();
      setAccessToken(access_token);
      return { access_token, item_id };
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

  const fetchAndSaveAssets = async (token: string) => {
    try {
      const response = await fetch("/api/plaid/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      });

      const data = await response.json();
      if (response.ok && user?.id) {
        const assetReport = (reportData: any) => {
          return (
            {
              asset_report_id: reportData.asset_report_id,
              client_report_id: reportData.client_report_id,
              date_generated: reportData.date_generated,
              days_requested: reportData.days_requested,
              items: reportData.items,
              user_info: reportData.user,
              created_at: new Date().toISOString(),
            }
          );
        };
        await saveAssetReport(data.assets, user?.id);
      } else {
        // throw new Error(data.message || "Error fetching asset report");
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error(`Error fetching asset report: ${getErrorMessage(error)}`);
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
          is_connected_bank: true,
        })
      );
      return data.user_token;
    } catch (error) { }
  };

  const onSuccess = useCallback(
    async (publicToken: string) => {
      setIsLoading(true);
      const { access_token, item_id } = await exchangePublicToken(publicToken) || {};
      const token = access_token;
      if (token) {
        await dispatch(
          updateUser({
            plaid_access_token: token,
            item_id: item_id
          })
        );
        await fetchUserIdentity(token);
        await fetchTransactions(token);
        await fetchInvestments(token);
        // await fetchLiabilities(token); TODO hide Liabilities
        await fetchBalances(token);
        await fetchAndSaveAssets(token);
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
