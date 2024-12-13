"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useEffect, FC } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchUserByEmailOrPhone } from "@/lib/store/features/user/userSlice";
import {
  fetchChatsByUserId,
  fetchMessagesForChat,
  setIsLoading,
  setChatId,
  resetChat,
} from "@/lib/store/features/chat/chatSlice";
import { setCategory } from "@/lib/store/features/category/categorySlice";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks";

interface InitializerProps {}

const Initializer: FC<InitializerProps> = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const { chats } = useChat();

  useEffect(() => {
    (async () => {
      const data: any = await dispatch(fetchUserByEmailOrPhone());
      if (data.payload?.id) {
        dispatch(fetchChatsByUserId(data.payload?.id as string));
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (params.id) {
        dispatch(fetchMessagesForChat(params.id as string));
        dispatch(setChatId(params.id as string));
      } else {
        dispatch(setIsLoading(false));
        dispatch(resetChat());
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (params.id && chats.length > 0) {
        const chatData = chats.find((chat) => chat.id === params.id);
        if (chatData) {
          dispatch(setCategory(chatData.category));
        }
      }
    })()
  },[dispatch, chats, params])

  return (
    <ProgressBar
      height="4px"
      color="#515AD9"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
};

export { Initializer };
