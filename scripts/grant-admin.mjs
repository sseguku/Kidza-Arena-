#!/usr/bin/env node
/**
 * Grant admin role to a Supabase Auth user by email.
 * Usage: npm run grant-admin -- admin@kidzaarena.com
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

loadEnvLocal();

const email = (process.argv[2] ?? "admin@kidzaarena.com").trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: listData, error: listError } =
  await supabase.auth.admin.listUsers({ perPage: 1000 });

if (listError) {
  console.error("Failed to list users:", listError.message);
  process.exit(1);
}

const user = listData.users.find(
  (u) => u.email?.toLowerCase() === email,
);

if (!user) {
  console.error(`No auth user found for: ${email}`);
  console.error("Create the user in Supabase → Authentication → Users first.");
  process.exit(1);
}

const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .upsert(
    {
      id: user.id,
      email: user.email ?? email,
      full_name: user.user_metadata?.full_name ?? "Admin",
      role: "admin",
    },
    { onConflict: "id" },
  )
  .select("id, email, role, full_name")
  .single();

if (profileError) {
  console.error("Failed to upsert profile:", profileError.message);
  console.error(
    "If the profiles table is missing, run supabase/grant-admin.sql in the SQL Editor.",
  );
  process.exit(1);
}

console.log("Admin access granted:");
console.log(profile);
console.log(`\nSign in at /login with ${email}`);
