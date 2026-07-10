import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import {
  getSupabaseEnv,
  getSupabaseServiceRoleKey,
} from "@/lib/supabase/env";

/**
 * Optional server-only client with service role — bypasses RLS.
 * Not required when using publishable key + RLS policies.
 */
export function createSupabaseAdminClient() {
  const serviceKey = getSupabaseServiceRoleKey();
  if (!serviceKey) return null;

  try {
    const { url } = getSupabaseEnv();
    return createClient<Database>(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch {
    return null;
  }
}
