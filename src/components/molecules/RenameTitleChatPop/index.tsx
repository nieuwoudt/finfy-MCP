"use client";

import { Dialog, Button, Field } from "@/components/atoms";
import { Loader2 } from "lucide-react";
import { useChat } from "@/hooks";
import { FC, PropsWithChildren, useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/helpers";

interface RenameTitleChatPopProps extends PropsWithChildren {
  chatId: string;
  title: string;
  handleClose: () => void;
}

const RenameTitleChatPop: FC<RenameTitleChatPopProps> = ({
  children,
  chatId,
  title,
  handleClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const { updateChat } = useChat();
  const onSubmit = async (formData: FormData) => {
    const newTitle = formData.get("title") as string;
    try {
      setIsLoading(true);
      await updateChat(chatId, {
        title: newTitle,
      });

      toast.success("The tile was successfully changed!");
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
        <form action={onSubmit} className="mt-5">
          <Field full name={"title"} defaultValue={title} />
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
              className="!rounded-md"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog>
  );
};

export { RenameTitleChatPop };
