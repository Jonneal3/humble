import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";
import Navbar from "./Navbar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NavbarWrapper() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: credits } = await supabase
    .from("billing")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .single();

  return <Navbar user={user} credits={credits} />;
} 