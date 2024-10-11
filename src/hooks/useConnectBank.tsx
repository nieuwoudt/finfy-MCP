"use client";
import { useYodlee, usePlaid, useUser } from "@/hooks";

const useConnectBank = () => {
  const { user } = useUser();
  const yodleeData = useYodlee();
  const plaidData = usePlaid();

  const hookData = user?.selected_country === "ZA" ? yodleeData : plaidData;
  const {
    isLinkReady = false,
    open,
    transactions,
    openModal = false,
    isLoading = false,
    isAlreadyConnected
  }: any = hookData;

  return {
    isLinkReady,
    open,
    transactions,
    openModal,
    isLoading,
    isAlreadyConnected,
  };
};

export { useConnectBank };
