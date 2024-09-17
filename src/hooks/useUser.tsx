import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  fetchUserByEmailOrPhone,
} from "@/lib/store/features/user/userSlice";
import { User } from "@/types";

export const useUser = () => {
  const dispatch: AppDispatch = useDispatch();

  const userState = useSelector((state: RootState) => state.user);

  const fetchCurrentUser = useCallback(() => {
    dispatch(fetchUserByEmailOrPhone());
  }, [dispatch]);

  const fetchUserByIdCallback = useCallback(
    async (id: number) => {
      await dispatch(fetchUserById(id));
    },
    [dispatch]
  );

  const createUserCallback = useCallback(
    async (newUser: Pick<User, "email">) => {
      await dispatch(createUser(newUser));
    },
    [dispatch]
  );

  const updateUserCallback = useCallback(
    async (updatedUser: Partial<User>) => {
      await dispatch(updateUser(updatedUser));
    },
    [dispatch]
  );

  const deleteUserCallback = useCallback(
    async (userId: number) => {
      await dispatch(deleteUser(userId));
    },
    [dispatch]
  );

  return {
    user: userState.user,
    status: userState.status,
    error: userState.error,
    statusUpdate: userState.statusUpdate,
    fetchCurrentUser,
    fetchUserById: fetchUserByIdCallback,
    createUser: createUserCallback,
    updateUser: updateUserCallback,
    deleteUser: deleteUserCallback,
  };
};
