"use client";
import { useNavigationOnboarding } from "@/hooks";

import { Button, Icon } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { usePlaid } from "@/hooks";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/helpers";

const CardLinkAccount = () => {
  const { nextStep } = useNavigationOnboarding();
  const { openPlaidLink, isPlaidLinkReady, isLoading, transactions } =
    usePlaid();

  useEffect(() => {
    if (transactions?.length) {
      toast.success("The bank connection was successful");
      nextStep();
    }
  }, [transactions?.length]);

  return (
    <CardTemplate
      title="Here's why you should link yours:"
      description="Please enter the code sent via text"
    >
      <div id="container-fastlink">
        <div style={{ textAlign: "center" }}>
          <input type="submit" id="btn-fastlink" value="Link an Account" />
        </div>
      </div>
      <CardTemplate.Content>
        <div className="space-y-3 text-grey-15">
          <div className="flex gap-2 items-center">
            <Icon type={"CheckIcon"} />
            <p className="text-sm font-medium">
              It&apos;s bank-level secure, private and insured.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Icon type={"CheckIcon"} />
            <p className="text-sm font-medium">
              Balances and transactions are updated automatically.
            </p>
          </div>
          <div className="flex gap-2 items-center">
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
            disabled={!isPlaidLinkReady || isLoading}
            className="my-4 w-full text-white"
          >
            {!isPlaidLinkReady || isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "LINK YOUR OWN ACCOUNT"
            )}
          </Button>
          <Button
            onClick={() => nextStep()}
            full
            variant="ghost"
            className="text-center text-sm font-medium text-grey-15"
          >
            Not ready to link an account?
          </Button>
        </div>
      </CardTemplate.Footer>
    </CardTemplate >
  );
};

export { CardLinkAccount };
