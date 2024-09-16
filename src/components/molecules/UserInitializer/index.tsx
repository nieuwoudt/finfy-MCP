"use client";

import { useEffect, FC } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchUserByEmail } from "@/lib/store/features/user/userSlice";

interface UserInitializerProps {}

const UserInitializer: FC<UserInitializerProps> = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserByEmail());
  }, [dispatch]);

  return null;
};

export { UserInitializer };
