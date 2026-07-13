import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Server-side client for public availability reads.
 * Prefers service role so calendar data matches admin dashboard regardless of session/RLS.
 */
export async function getAvailabilityReadClient(): Promise<SupabaseClient<Database>> {
  const service = createSupabaseAdminClient();
  if (service) return service;

  return createClient();
}
