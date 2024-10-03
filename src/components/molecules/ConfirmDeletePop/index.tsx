"use client";

import { Dialog, Button } from "@/components/atoms";
import { Loader2 } from "lucide-react";
import { useChat } from "@/hooks";
import { FC, PropsWithChildren, useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/helpers";

interface ConfirmDeletePopProps extends PropsWithChildren {
  chatId: string;
  handleClose: () => void;
}

const ConfirmDeletePop: FC<ConfirmDeletePopProps> = ({
  children,
  chatId,
  handleClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { deleteChat } = useChat();
  const handleClickDelete = async () => {
    try {
      setIsLoading(true);
      await deleteChat(chatId);
      toast.success("The chat was successfully deleted!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      handleClose();
      setOpen(false);
      setIsLoading(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger className="text-sm w-full">{children}</Dialog.Trigger>
      <Dialog.Content className="text-white bg-navy-25 rounded-none border-none pt-4 max-w-96">
        <Dialog.Header className="mb-0 mt-5">
          <div className="flex items-center">
            <Dialog.Title className="font-semibold text-2xl text-center">
              Are you sure you want to delete the chat?
            </Dialog.Title>
          </div>
        </Dialog.Header>
        <div className="flex w-full items-center justify-between !mt-12">
          <Dialog.Close asChild>
            <Button size="xl" variant="destructive" className="!rounded-md">
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            size="xl"
            type={"submit"}
            disabled={isLoading}
            onClick={handleClickDelete}
            className="!rounded-md"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Yes"}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export { ConfirmDeletePop };
