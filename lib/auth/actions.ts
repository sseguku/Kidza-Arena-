"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function getProfileRole(userId: string): Promise<string | null> {
  const admin = createSupabaseAdminClient();
  if (admin) {
    const { data } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    if (data?.role) return data.role;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return data?.role ?? null;
}

export async function signInAction(
  formData: FormData,
): Promise<{ error: string } | void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/admin/dashboard";

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in failed. Please try again." };
  }

  const role = await getProfileRole(user.id);

  if (!role) {
    await supabase.auth.signOut();
    return {
      error:
        "No admin profile found for this account. Run: npm run grant-admin -- your@email.com",
    };
  }

  if (role !== "admin") {
    await supabase.auth.signOut();
    return { error: "You do not have admin access." };
  }

  redirect(next);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
