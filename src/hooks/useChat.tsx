import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  sendChatQuery,
  createChat,
  fetchChatsByUserId,
  updateChat,
  deleteChat,
  fetchMessagesForChat,
  createMessage,
} from "@/lib/store/features/chat/chatSlice";

export const useChat = () => {
  const dispatch: AppDispatch = useDispatch();

  const chatState = useSelector((state: RootState) => state.chat);

  const fetchChatsCallback = useCallback(
    (user_id: string) => {
      dispatch(fetchChatsByUserId(user_id));
    },
    [dispatch]
  );

  const fetchMessagesForChatCallback = useCallback(
    async (chatId: string) => {
      await dispatch(fetchMessagesForChat(chatId));
    },
    [dispatch]
  );

  const fetchCreateMessage = useCallback(
    async ({
      chat_id,
      user_id,
      content,
      message_type,
      is_processed,
      response_time,
    }: any) => {
      await dispatch(
        createMessage({
          chat_id,
          user_id,
          content,
          message_type,
          is_processed,
          response_time,
        })
      );
    },
    [dispatch]
  );

  const sendChatQueryCallback = useCallback(
    async (
      user_id: string,
      chat_id: string,
      history: string[],
      user_query: string
    ) => {
      await dispatch(
        sendChatQuery({
          user_id,
          chat_id,
          history,
          user_query,
        })
      );
    },
    [dispatch]
  );

  const createChatCallback = useCallback(
    async (userId: string) => {
      const data = await dispatch(createChat(userId));
      return data;
    },
    [dispatch]
  );

  const updateChatCallback = useCallback(
    async (chatId: string, userId: number) => {
      await dispatch(updateChat({ id: chatId, user_id: userId }));
    },
    [dispatch]
  );

  const deleteChatCallback = useCallback(
    async (chatId: string) => {
      await dispatch(deleteChat(chatId));
    },
    [dispatch]
  );

  return {
    chats: chatState.chats,
    messages: chatState.messages,
    loading: chatState.loading,
    error: chatState.error,
    chatId: chatState.chat_id,
    history: chatState.history,
    fetchChats: fetchChatsCallback,
    fetchMessagesForChat: fetchMessagesForChatCallback,
    sendChatQuery: sendChatQueryCallback,
    createChat: createChatCallback,
    updateChat: updateChatCallback,
    deleteChat: deleteChatCallback,
    createMessage: fetchCreateMessage,
  };
};
