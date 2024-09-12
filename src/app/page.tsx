// import { HomePage } from "@/components/pages";
import { createSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  return <p>Hello {data.user.email}</p>;
}
