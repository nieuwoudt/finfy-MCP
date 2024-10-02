"use client";

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
  resetChat,
  setIsLoadingSendMessage,
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

  const handleResetChat = useCallback(() => {
    dispatch(resetChat());
  }, [dispatch]);

  const setIsLoadingSendQuery = useCallback(
    (loading: boolean) => {
      dispatch(setIsLoadingSendMessage(loading));
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
    async (data: any) => {
      await dispatch(createMessage(data));
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
      const data = await dispatch(
        sendChatQuery({
          user_id,
          chat_id,
          history,
          user_query,
        })
      );
      return data;
    },
    [dispatch]
  );

  const createChatCallback = useCallback(
    async (userId: string, title: string) => {
      const data = await dispatch(createChat({ userId, title }));
      return data;
    },
    [dispatch]
  );

  const updateChatCallback = useCallback(
    async (chatId: string, updateData: any) => {
      await dispatch(updateChat({ id: chatId, updateData }));
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
    isLoading: chatState.loadingSendMessage,
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
    setIsLoadingSendQuery,
    handleResetChat,
  };
};
