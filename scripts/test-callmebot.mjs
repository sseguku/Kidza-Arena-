#!/usr/bin/env node
/**
 * Send a test WhatsApp via CallMeBot.
 * Usage: npm run test:whatsapp
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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

const apiKey = process.env.CALLMEBOT_API_KEY;
const phone = process.env.BOOKING_NOTIFY_WHATSAPP ?? "+256744320191";

if (!apiKey) {
  console.error("Missing CALLMEBOT_API_KEY in .env.local");
  process.exit(1);
}

const message =
  "Kidza Arena test — CallMeBot is working. You will receive booking alerts here.";

const url = new URL("https://api.callmebot.com/whatsapp.php");
url.searchParams.set("source", "nextjs-test");
url.searchParams.set("phone", phone.startsWith("+") ? phone : `+${phone}`);
url.searchParams.set("text", message);
url.searchParams.set("apikey", apiKey);

console.log("Sending test WhatsApp to", phone, "...");

const response = await fetch(url.toString());
const body = await response.text();

console.log("Status:", response.status);
console.log("Response:", body);

if (!response.ok || /error|invalid|not activated/i.test(body)) {
  process.exit(1);
}

console.log("Success — check WhatsApp on", phone);
