import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Browser Supabase client for Client Components.
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
export function createClient() {
  const { url, key } = getSupabaseEnv();
  return createBrowserClient<Database>(url, key);
}

/** @deprecated Use `createClient` */
export const createBrowserSupabaseClient = createClient;

/** Generic client for non-SSR usage */
export function createSupabaseServerClient() {
  const { url, key } = getSupabaseEnv();
  return createSupabaseClient<Database>(url, key);
}
