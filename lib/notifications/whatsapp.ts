import {
  buildBookingNotificationText,
  getBookingNotifyWhatsApp,
  toWhatsAppE164,
} from "@/lib/notifications/booking-summary";
import type { BookingRecord } from "@/types/booking";

type SendResult = { sent: boolean; error?: string };

/**
 * CallMeBot free WhatsApp API — personal use.
 * @see https://www.callmebot.com/blog/free-api-whatsapp-messages/
 *
 * One-time setup on +256744320191:
 * 1. Add +34 644 20 47 56 to contacts
 * 2. WhatsApp message: "I allow callmebot to send me messages"
 * 3. Copy the API key into CALLMEBOT_API_KEY
 */
export async function sendWhatsAppBookingNotification(
  booking: BookingRecord,
): Promise<SendResult> {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!apiKey) {
    console.warn("[whatsapp] CALLMEBOT_API_KEY not set — skipping notification");
    return { sent: false, error: "CallMeBot not configured" };
  }

  const phone = toWhatsAppE164(getBookingNotifyWhatsApp());
  const message = buildBookingNotificationText(booking);

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("source", "nextjs");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", message);
  url.searchParams.set("apikey", apiKey);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });
    const body = (await response.text()).trim();

    const lower = body.toLowerCase();
    const failed =
      lower.includes("not activated") ||
      lower.includes("invalid apikey") ||
      lower.includes("invalid phone") ||
      (lower.includes("error") && !lower.includes("message queued"));

    if (failed) {
      console.warn("[whatsapp] CallMeBot error:", body);
      return { sent: false, error: body.replace(/<[^>]+>/g, " ").trim() };
    }

    if (!response.ok) {
      console.warn("[whatsapp] CallMeBot HTTP", response.status, body);
      return { sent: false, error: body || `HTTP ${response.status}` };
    }

    console.info("[whatsapp] CallMeBot notification sent to", phone);
    return { sent: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.warn("[whatsapp] CallMeBot request failed:", error);
    return { sent: false, error };
  }
}
