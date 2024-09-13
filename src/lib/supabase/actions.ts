"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/utils/helpers";

export const createAccountAction = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { auth } = createSupabaseClient();
    const { error } = await auth.signUp({ password, email });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const loginAction = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { auth } = createSupabaseClient();
    const { error } = await auth.signInWithPassword({ password, email });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const signOutAction = async () => {
  try {
    const { auth } = createSupabaseClient();
    const { error } = await auth.signOut();
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const signInWithOtp = async (phone: string) => {
  try {
    const { auth } = supabase;
    const { error } = await auth.signInWithOtp({
      phone,
    });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const verifyPhoneUser = async (phone: string, token: string) => {
  try {
    const { auth } = createSupabaseClient();
    const { error } = await auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const resendCodeOTP = async (phone: string) => {
  try {
    const { auth } = createSupabaseClient();
    const { error } = await auth.resend({
      phone,
      type: "sms",
    });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};
