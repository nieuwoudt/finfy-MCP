"use client";

import { useChat, useUser } from "@/hooks";
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
  const handleClick = async () => {
    if (!isLoading) {
      setIsLoadingSendQuery(true);
      const value = question;
      const userId = user?.id;
      if (value && userId) {
        let currentChatId = chatId;
        if (!currentChatId) {
          const chat = await createChat(userId, value);
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
          setSuggestQuestions(null);
          const data: any = await sendChatQuery(
            `${userId}`,
            currentChatId,
            history,
            value,
            user?.selected_country === "ZA" ? "yodlee" : "plaid"
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
