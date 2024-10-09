"use client";

import { useConnectBank, usePlaid } from "@/hooks";
import { Loader2 } from "lucide-react";
import { ActionButton } from "@/components/molecules";
import { Icon } from "@/components/atoms";

const ConnectBankAction = () => {
  const { open, isLinkReady, isLoading, isAlreadyConnected } = useConnectBank();
  if (isAlreadyConnected) {
    return null;
  }
  return (
    <ActionButton
      onClick={() => open()}
      disabled={!isLinkReady}
      Icon={
        <>
          {!isLinkReady || isLoading ? (
            <Loader2 className="animate-spin w-3 h-3" />
          ) : (
            <Icon
              type="UserSolidIcon"
              className="fill-purple-15 group-hover:fill-white h-3.5 w-5"
            />
          )}
        </>
      }
      text={"Link Accounts"}
    />
  );
};

export { ConnectBankAction };
