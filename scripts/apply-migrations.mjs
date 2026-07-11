#!/usr/bin/env node
/**
 * Apply Supabase SQL migrations in order.
 *
 * Requires DATABASE_URL in .env.local (Supabase Dashboard → Project Settings → Database → Connection string).
 *
 * Usage: npm run db:migrate
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const migrationsDir = join(root, "supabase", "migrations");

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

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL.\n\n" +
      "Add your Supabase Postgres connection string to .env.local:\n" +
      "DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres\n\n" +
      "Or paste supabase/bootstrap.sql into the Supabase SQL Editor and run it manually.",
  );
  process.exit(1);
}

const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

const sql = postgres(databaseUrl, { ssl: "require", max: 1 });

try {
  for (const file of files) {
    const path = join(migrationsDir, file);
    const contents = readFileSync(path, "utf8");
    console.log(`Applying ${file}...`);
    await sql.unsafe(contents);
    console.log(`✓ ${file}`);
  }
  console.log("\nAll migrations applied successfully.");
} catch (error) {
  console.error("\nMigration failed:", error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await sql.end({ timeout: 5 });
}
