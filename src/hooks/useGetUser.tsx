"use client";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

function getAuth() {
  const { auth } = supabase;
  return auth;
}

const useGetUser = () => {
  const [user, setUser] = useState<any | null>(null);

  const auth = getAuth();

  // auth.onAuthStateChange(async (event, session) => {
  //   const sessionUser = session?.user;
  //   const shouldUpdate = sessionUser?.updated_at !== user?.updated_at;
  //   if (shouldUpdate) {
  //     if (sessionUser) {
  //       const user = await fetch("/api/get-user").then((res) => res.json());
  //       setUser(user);
  //     } else {
  //       setUser(null);
  //     }
  //   }
  // });

  return user;
};

export { useGetUser };
