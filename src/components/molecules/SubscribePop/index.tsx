"use client";

import { Dialog, Button, Field } from "@/components/atoms";
import { Loader2 } from "lucide-react";
import { FC, PropsWithChildren, useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/helpers";
import { config } from "@/config/env";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
interface SubscribePopProps extends PropsWithChildren {}

const SubscribePop: FC<SubscribePopProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>(
    config.STRAPI_YEARLY_ID as string
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };
  const [open, setOpen] = useState(false);

  const onSubmit = () => {
    if (selectedOption) {
      router.push(`${config.STRAPI_PLAN_LINK}${selectedOption}`);
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger className="text-sm w-full">{children}</Dialog.Trigger>
      <Dialog.Content className="text-white bg-navy-25 rounded-none border-none pt-4 max-w-96">
        <form action={onSubmit} className="mt-5 gap-4 flex-col flex w-full">
          <div className="flex gap-4">
            <Field
              full
              name={"plan"}
              type={"radio"}
              value={config.STRAPI_MONTHLY_ID}
              label={
                <div className="p-2 flex flex-col gap-1 cursor-pointer">
                  <span className="text-[10px] text-grey-15 font-normal">
                    Billed Monthly
                  </span>
                  <span className="text-white text-xs font-medium flex gap-0.5">
                    $20
                    <span className="text-[10px] text-grey-15">/mo</span>
                  </span>
                </div>
              }
              onChange={handleChange}
              checked={selectedOption === config.STRAPI_MONTHLY_ID}
              id={"monthly"}
              classes={{
                containerInput: "hidden",
                container: cn("border border-navy-5 rounded-sm", {
                  "border-purple-15 border-2":
                    selectedOption === config.STRAPI_MONTHLY_ID,
                }),
              }}
            />
            <Field
              full
              name={"plan"}
              type={"radio"}
              value={config.STRAPI_YEARLY_ID}
              label={
                <div className="p-2 flex flex-col gap-1 cursor-pointer">
                  <span className="text-[10px] text-grey-15 font-normal">
                    Billed Yearly
                  </span>
                  <span className="text-white text-xs font-medium flex gap-0.5 ">
                    $15
                    <span className="text-[10px] text-grey-15">/mo</span>
                  </span>
                </div>
              }
              onChange={handleChange}
              checked={selectedOption === config.STRAPI_YEARLY_ID}
              id={"yearly"}
              classes={{
                containerInput: "hidden",
                container: cn("border border-navy-5 rounded-sm", {
                  "border-purple-15 border-2":
                    selectedOption === config.STRAPI_YEARLY_ID,
                }),
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2 items-center justify-between !mt-12">
            <Button
              size="xl"
              type={"submit"}
              full
              disabled={isLoading}
              className="!rounded-md"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Get Pro"}
            </Button>
            <Dialog.Close asChild>
              <Button
                gap-4
                size="xl"
                full
                variant="destructive"
                className="!rounded-md"
              >
                Not now
              </Button>
            </Dialog.Close>
          </div>
        </form>
      </Dialog.Content>
    </Dialog>
  );
};

export { SubscribePop };
