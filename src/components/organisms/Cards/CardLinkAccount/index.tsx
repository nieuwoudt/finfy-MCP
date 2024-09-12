"use client";

import { Button, Icon } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
// import { useNavigationOnboarding } from "@/hooks";
// import { useTransition } from "react";
import { usePlaid } from "@/hooks";

const CardLinkAccount = () => {
  const { openPlaidLink, isPlaidLinkReady, transactions } = usePlaid();
  console.log(transactions, "transactions");
  return (
    <CardTemplate
      title="Here's why you should link yours:"
      description="Please enter the code sent via text"
    >
      <CardTemplate.Content>
        <div className="space-y-3 text-grey-15">
          <div className="flex">
            <Icon type={"CheckIcon"} />
            <p className="text-sm font-medium">
              It&apos;s bank-level secure, private and insured.
            </p>
          </div>
          <div className="flex">
            <Icon type={"CheckIcon"} />
            <p className="text-sm font-medium">
              Balances and transactions are updated automatically.
            </p>
          </div>
          <div className="flex">
            <Icon type={"CheckIcon"} />
            <p className="text-sm font-medium">
              So there&apos;s no need to import statements manually.
            </p>
          </div>
        </div>
      </CardTemplate.Content>
      <CardTemplate.Footer className="flex gap-4 mt-4">
        <div className="w-full">
          <Button
            onClick={() => openPlaidLink()}
            disabled={!isPlaidLinkReady}
            className="my-4 w-full text-white"
          >
            LINK YOUR OWN ACCOUNT
          </Button>
          <p className="text-center text-sm font-medium text-grey-15">
            Not ready to link an account?
          </p>
        </div>
      </CardTemplate.Footer>
    </CardTemplate>
  );
};

export { CardLinkAccount };
