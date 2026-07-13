import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminClient } from "@/lib/auth/session";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/** Prefer service role for admin writes; fall back to authenticated admin session. */
export async function getAdminDataClient(): Promise<SupabaseClient<Database>> {
  const service = createSupabaseAdminClient();
  if (service) return service;

  const { supabase } = await getAdminClient();
  return supabase;
}

export function normalizeTimeValue(time: string): string {
  const trimmed = time.trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{2}:\d{2}$/.test(trimmed)) return `${trimmed}:00`;
  return trimmed;
}
