"use client";

import { useConnectBank, usePlaid } from "@/hooks";
import { Loader2 } from "lucide-react";
import { ActionButton } from "@/components/molecules";
import { Icon } from "@/components/atoms";

const ConnectBankAction = ({ inputMenu }: { inputMenu?: boolean }) => {
  const { open, isLinkReady, isLoading, isAlreadyConnected } = useConnectBank();
  if (isAlreadyConnected) {
    return null;
  }

  if ( inputMenu ) {
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
  }

  return (
    <ActionButton
      className="home-assist-btn group border border-[#6870DA] gap-1 items-center flex text-sm text-normal !py-2 !px-4 !rounded-[8px]"
      onClick={() => open()}
      disabled={!isLinkReady}
      SecondIcon={
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
