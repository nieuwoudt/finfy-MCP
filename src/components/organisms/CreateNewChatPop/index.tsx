"use client";

import { Button, Dialog, Icon } from "@/components/atoms";
import { FC, PropsWithChildren, useState } from "react";
import { AssistInput } from "@/components/organisms";

interface CreateNewChatPopProps extends PropsWithChildren {}

const CreateNewChatPop: FC<CreateNewChatPopProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger className="text-sm w-full">{children}</Dialog.Trigger>
      <Dialog.Content className="rounded-none border-none pt-4 max-w-none flex flex-col w-full">
        <Dialog.Close className="w-fit self-end">
          <Icon
            type="CloseIcon"
            className={"w-6 h-6 stroke-2 stroke-grey-15"}
          />
        </Dialog.Close>
        <AssistInput
          handleClose={handleClose}
          classes={{
            container: "top-0",
          }}
        />
      </Dialog.Content>
    </Dialog>
  );
};

export { CreateNewChatPop };
