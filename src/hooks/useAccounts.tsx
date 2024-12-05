"use client";

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchAccounts,
  fetchAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  fetchAccountsByUserId
} from "@/lib/store/features/accounts/accountsSlice";
import { Account } from "@/types";
import { useUser } from "./useUser";

export const useAccounts = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useUser();

  const accountsState = useSelector((state: RootState) => state.accounts);
  const prefix = user?.selected_country === "ZA" ? "_yodlee" : "";

  const fetchAllAccounts = useCallback(async () => {
    await dispatch(fetchAccounts());
  }, [dispatch]);

  const fetchAccountByIdCallback = useCallback(
    async (id: string) => {
      await dispatch(fetchAccountById(id));
    },
    [dispatch]
  );

  const fetchAccountsByUserIdCallback = useCallback(
    async (userId: string) => {
      await dispatch(fetchAccountsByUserId({ userId, prefix }));
    },
    [dispatch, prefix]
  );

  const createAccountCallback = useCallback(
    async (newAccount: Omit<Account, "id">) => {
      await dispatch(createAccount(newAccount));
    },
    [dispatch]
  );

  const updateAccountCallback = useCallback(
    async (updatedAccount: Partial<Account>) => {
      await dispatch(updateAccount(updatedAccount));
    },
    [dispatch]
  );

  const deleteAccountCallback = useCallback(
    async (accountId: string) => {
      await dispatch(deleteAccount({ accountId, prefix }));
    },
    [dispatch, prefix]
  );

  return {
    accounts: accountsState.accounts,
    status: accountsState.status,
    error: accountsState.error,
    fetchAllAccounts,
    fetchAccountById: fetchAccountByIdCallback,
    fetchAccountsByUserId: fetchAccountsByUserIdCallback,
    createAccount: createAccountCallback,
    updateAccount: updateAccountCallback,
    deleteAccount: deleteAccountCallback,
  };
};