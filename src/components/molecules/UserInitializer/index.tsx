"use client";

import { useEffect, FC } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchUserByEmailOrPhone } from "@/lib/store/features/user/userSlice";

interface UserInitializerProps {}

const UserInitializer: FC<UserInitializerProps> = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserByEmailOrPhone());
  }, [dispatch]);

  return null;
};

export { UserInitializer };
