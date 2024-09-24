"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useEffect, FC } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchUserByEmailOrPhone } from "@/lib/store/features/user/userSlice";
import {
  fetchChatsByUserId,
  fetchMessagesForChat,
  setIsLoading,
  resetChat,
} from "@/lib/store/features/chat/chatSlice";
import { useParams } from "next/navigation";

interface InitializerProps {}

const Initializer: FC<InitializerProps> = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

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
      } else {
        dispatch(setIsLoading(false));
        dispatch(resetChat());
      }
    })();
  }, [params.id, dispatch]);

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
