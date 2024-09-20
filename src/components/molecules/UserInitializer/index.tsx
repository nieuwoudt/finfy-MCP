"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useEffect, FC } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchUserByEmailOrPhone } from "@/lib/store/features/user/userSlice";

interface UserInitializerProps {}

const UserInitializer: FC<UserInitializerProps> = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserByEmailOrPhone());
  }, [dispatch]);

  return (
    <ProgressBar
      height="5px"
      color="#515AD9"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
};

export { UserInitializer };
