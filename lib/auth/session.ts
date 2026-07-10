import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminSession } from "@/types/admin";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    userId: user.id,
    email: user.email ?? profile.email,
    profile,
  };
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/admin/dashboard");
  }

  if (session.profile.role !== "admin") {
    redirect("/login?error=unauthorized");
  }

  return session;
}

export async function getAdminClient() {
  const session = await requireAdmin();
  const supabase = await createClient();
  return { supabase, session };
}
