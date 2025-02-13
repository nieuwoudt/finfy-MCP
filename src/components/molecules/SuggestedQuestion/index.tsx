"use client";

import { useCategory, useChat, useUser } from "@/hooks";
import { Category } from "@/lib/store/features/category/categorySlice";
import { useRouter } from "next/navigation";
import { FC } from "react";
import toast from "react-hot-toast";

interface SuggestedQuestionProps {
  question: string;
}

const SuggestedQuestion: FC<SuggestedQuestionProps> = ({ question }) => {
  const { user } = useUser();
  const router = useRouter();
  const {
    createChat,
    sendChatQuery,
    createMessage,
    chatId,
    history,
    isLoading,
    setIsLoadingSendQuery,
    setSuggestQuestions,
  } = useChat();
  const { category } = useCategory();

  const handleClick = async () => {
    if (!isLoading) {
      setIsLoadingSendQuery(true);
      const value = question;
      const userId = user?.id;
      if (value && userId) {
        let currentChatId = chatId;
        let chatCategory = undefined;
        if (!currentChatId) {
          const chat = await createChat(userId, value, category ? category : Category.ASSISTANT);
          currentChatId = chat.payload.id;
          chatCategory = chat.payload.category;
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
          setSuggestQuestions(null);
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
              content: JSON.stringify(data.payload.output),
              // content: data.payload.output.text || data.payload.output,
              message_type: "bot",
              is_processed: true,
            });
          }
        }
      }
      setIsLoadingSendQuery(false);
    }
  };
  return (
    <button
      onClick={handleClick}
      className="border flex-1 min-w-72 max-w-72 h-16 flex justify-start text-start items-start text-white text-xs md:text-sm bg-navy-15 rounded-md p-2 md:p-3 border-navy-5"
    >
      <span className="overflow-hidden line-clamp-2">{question}</span>
    </button>
  );
};

export { SuggestedQuestion };
