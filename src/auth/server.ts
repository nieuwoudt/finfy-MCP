import { createSupabaseClient } from "@/lib/supabase/server";

export const getUser = async () => {
  const { auth } = createSupabaseClient();
  const user = (await auth.getUser()).data.user;
  return user;
};

export const protectRouter = async () => {
  const user = await getUser();
  if (!user) throw Error("Unauthorized");
};
