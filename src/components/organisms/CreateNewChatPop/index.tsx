"use client";

import { Button, Dialog, Icon } from "@/components/atoms";
import { FC, PropsWithChildren, useState } from "react";
import { AssistInput } from "@/components/organisms";
import { useSidebar } from "@/hooks";

interface CreateNewChatPopProps extends PropsWithChildren {}

const CreateNewChatPop: FC<CreateNewChatPopProps> = ({ children }) => {
  const { handleClose: handleCloseSidebar } = useSidebar();
  const [open, setOpen] = useState(false);
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
  };

  const handleClose = () => {
    setOpen(false);
    if (window.innerWidth <= 768) {
      handleCloseSidebar();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger className="text-sm w-full">{children}</Dialog.Trigger>
      <Dialog.Content className="rounded-none border-none bottom-7 md:bottom-auto top-auto md:top-1/2 translate-y-0 md:-translate-y-1/2 pt-4 max-w-none flex flex-col w-full">
        <Dialog.Close asChild className="w-fit self-end -top-14 right-4 absolute z-[60] cursor-pointer">
          <Icon
            type="CloseIcon"
            className={"w-6 h-6 stroke-2 stroke-grey-15 "}
          />
        </Dialog.Close>
        <AssistInput
          handleClose={handleClose}
          classes={{
            container: "top-1/2 -translate-y-1/2 bottom-auto",
            wrapper: "!absolute !top-1/2 -translate-y-1/2 w-full !right-auto !left-1/2 -translate-x-1/2 z-50",
          }}
        />
      </Dialog.Content>
    </Dialog>
  );
};

export { CreateNewChatPop };
