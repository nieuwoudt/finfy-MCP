"use client";
import { useConnectBank, useNavigationOnboarding } from "@/hooks";

import { Button, Dialog, Icon } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { Loader2 } from "lucide-react";
import { FC, useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { withRedirect } from "@/hoc";
import { WithRedirectProps } from "@/types";

interface HomePageProps extends WithRedirectProps {}

const CardLinkAccount: FC<HomePageProps> = ({ redirect, pathRedirect }) => {
  const { nextStep, prevStep } = useNavigationOnboarding();
  const { isLinkReady, open, transactions, openModal, isLoading } =
    useConnectBank();

  useEffect(() => {
    if (transactions?.length && !isLoading) {
      toast.success("The bank connection was successful");
      if (pathRedirect) {
        redirect();
      } else {
        nextStep();
      }
    }
  }, [transactions?.length]);

  return (
    <>
      <CardTemplate
        title="Here's why you should link yours:"
        description="Please enter the code sent via text"
      >
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
              onClick={() => open && open()}
              disabled={!isLinkReady || isLoading}
              className="my-4 w-full text-white"
            >
              {!isLinkReady || isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "LINK YOUR OWN ACCOUNT"
              )}
            </Button>
            <Button
              size="xl"
              onClick={prevStep}
              variant="destructive"
              full
              className="mb-4"
            >
              Back
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
      </CardTemplate>
      <Dialog open={openModal}>
        <Dialog.Content
          isHideCloseButton
          className="bg-transparent !border-none !p-0"
        >
          <div id="container-fastlink" />
        </Dialog.Content>
      </Dialog>
    </>
  );
};

const CardLinkAccountComponent = withRedirect(CardLinkAccount);
export { CardLinkAccountComponent as CardLinkAccount };
