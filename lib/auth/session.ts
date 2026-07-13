import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { AdminSession } from "@/types/admin";

async function fetchProfile(userId: string) {
  const admin = createSupabaseAdminClient();
  if (admin) {
    const { data } = await admin
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("id", userId)
      .maybeSingle();
    if (data) return data;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", userId)
    .maybeSingle();

  return data;
}

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await fetchProfile(user.id);

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
