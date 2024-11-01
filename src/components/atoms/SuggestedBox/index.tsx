import { useChat, useUser } from "@/hooks";
import { useRouter } from "next/navigation";
import { FC } from "react";
import toast from "react-hot-toast";

interface SuggestBoxProps {
  label: string;
  content: string;
  icon: string;
}

const SuggestedBox: FC<SuggestBoxProps> = ({ content, label, icon }) => {
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
  } = useChat();

  const handleClick = async () => {
    if (!isLoading) {
      setIsLoadingSendQuery(true);
      const value = content;
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
          const data: any = await sendChatQuery(
            `${userId}`,
            currentChatId,
            history,
            value
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
    <button onClick={handleClick} className="suggest-box min-h-[112px] flex flex-col items-start block-suggest">
      <p className="text-white mb-1 text-start">
        {icon} {label}
      </p>
      <div className="relative text-grey-15">
        <p className="pr-6 text-wrap text-start">
          {content}
        </p>
        {/* <Icon
          type={"UpArrowIcon"}
          className="size-3 rotate-45 absolute bottom-0 right-0"
        /> */}
      </div>
    </button>
  );
};

export { SuggestedBox };
