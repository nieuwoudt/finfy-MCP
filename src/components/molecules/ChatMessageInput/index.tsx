"use client";

import { Button, Icon, Textarea } from "@/components/atoms";
import { useAutoResizeTextArea, useCategory, useChat, useUser } from "@/hooks";
import { Loader2 } from "lucide-react";
import { ChangeEvent, FC, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { ActionButton, ConnectBankAction, FocusAssistantPopover } from "@/components/molecules";
import { ActionButtonsGroupMobile } from "@/components/organisms/ActionButtonsGroup";
import { Category } from "@/lib/store/features/category/categorySlice";

interface ChatMessageInputProps {
  handleClose?: () => void;
  isDark?: boolean;
  category?: string;
}

const ChatMessageInput: FC<ChatMessageInputProps> = ({ handleClose, isDark = false }) => {
  const { user } = useUser();
  const router = useRouter();
  const {
    createChat,
    sendChatQuery,
    createMessage,
    handleResetChat,
    chatId,
    history,
    isLoading,
    setIsLoadingSendQuery,
    chatCategory
  } = useChat();
  const { category } = useCategory();

  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage Popover
  const textareaRef = useAutoResizeTextArea();
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const handleOpenPopup = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsPopupOpen(true);
  };

  const handleClosePopup = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsPopupOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
      setIsPopupOpen(false);
  };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const onSubmit = async (formData: FormData) => {
    if (!isLoading) {
      setIsLoadingSendQuery(true);
      const value = formData.get("message") as string;
      setMessage("");
      handleClose && handleClose();
      const userId = user?.id;
      if (value && userId) {
        let currentChatId = chatId;
        let currentChatCategory = chatCategory;
        if (handleClose) {
          handleResetChat();
        }
        if (!currentChatId || handleClose) {
          const chat = await createChat(userId, value, category ? category : Category.ASSISTANT);
          currentChatId = chat.payload.id;
          router.push(`/dashboard/chat/${currentChatId}`, undefined);
        }
        if (currentChatId) {
          createMessage({
            chat_id: currentChatId,
            user_id: userId,
            content: value,
            message_type: "user",
            is_processed: true,
          });
          const data: any = await sendChatQuery(
            `${userId}`,
            currentChatId,
            history,
            value,
            user?.selected_country === "ZA" ? "yodlee" : "plaid",
            category ? category : Category.ASSISTANT
          );
          if (data?.error) {
            toast.error(data.error.message);
          } else {
            createMessage({
              chat_id: currentChatId,
              user_id: userId,
              content: data.payload.output.text || data.payload.output,
              message_type: "bot",
              is_processed: true,
              calculations: JSON.stringify(data.payload.calculations),
            });
          }
        }
      }
      setIsLoadingSendQuery(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setMessage(value);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (window.innerWidth > 768) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (form) {
          const formData = new FormData(form);
          onSubmit(formData);
        }
      }
    }
  };

  const setTextareaRef = (element: HTMLTextAreaElement) => {
    if (element) {
      element.focus();
      (textareaRef.current as any) = element;
    }
  };

  return (
    <form
      action={onSubmit}
      className="rounded-full mx-2 flex justify-between items-center lg:bg-navy-15 relative lg:border lg:border-[#374061]"
    >
      <div className="relative">
        <button
          type="button"
          className="w-10 h-10 pl-3 pt-2.5 pb-3 -mr-2 flex"
          onClick={isPopupOpen ? handleClosePopup : handleOpenPopup}
        >
          <Icon type="PlusIcon" className={cn("w-5 h-5", isPopupOpen ? "stroke-purple-15" : " stroke-slate-400")} />
        </button>

        {isPopupOpen && (
          <div
            ref={popoverRef}
            className="absolute w-max bg-[#272E48] rounded-md px-4 border-[#374061] border-[1px] py-2 bottom-16 left-0 z-50"
          >
            <ActionButtonsGroupMobile />
          </div>
        )}
      </div>

      <Textarea
        ref={setTextareaRef}
        value={message}
        onChange={handleChange}
        className={cn(
          "lg:pl-4 h-16 focus:outline-none text-base border-none resize-none text-white py-5 pr-24 lg:pr-48",
          isDark ? "lg:bg-[#1F263D]" : "lg:bg-navy-15"
        )}
        placeholder="Ask anything..."
        name="message"
        onKeyDown={handleEnter}
      />
      <div className="flex items-center gap-3 py-3 absolute right-4 top-1/2 -translate-y-1/2">
        <Button size="xl" type="submit" className="w-10 h-10 p-3">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Icon type="ArrowRightIcon" className="size-4 text-white" />
          )}
        </Button>
      </div>
    </form>
  );
};

export { ChatMessageInput };
