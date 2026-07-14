import { contact } from "@/lib/constants/contact";
import { formatTimeLabel } from "@/lib/booking/constants";
import { formatUGX } from "@/lib/booking/pricing";
import type { BookingRecord } from "@/types/booking";

export function getAdminBookingsUrl(): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${siteUrl.replace(/\/$/, "")}/admin/bookings?status=pending_approval`;
}

export function buildBookingNotificationText(booking: BookingRecord): string {
  const hour = parseInt(booking.start_time.split(":")[0] ?? "0", 10);
  const minute = parseInt(booking.start_time.split(":")[1] ?? "0", 10);
  const timeLabel = formatTimeLabel(hour, minute);

  return [
    "🏟️ *New Kidza Arena booking* — pending approval",
    "",
    `*Customer:* ${booking.full_name}`,
    `*Phone:* ${booking.phone}`,
    `*Email:* ${booking.email}`,
    booking.whatsapp ? `*WhatsApp:* ${booking.whatsapp}` : null,
    "",
    `*Type:* ${booking.booking_type}`,
    `*Date:* ${booking.booking_date}`,
    `*Time:* ${timeLabel} (${booking.duration_hours}h)`,
    `*Price:* ${formatUGX(booking.price_ugx)}`,
    booking.team_name ? `*Team:* ${booking.team_name}` : null,
    booking.player_count ? `*Players:* ${booking.player_count}` : null,
    booking.match_type ? `*Match:* ${booking.match_type}` : null,
    booking.notes ? `*Notes:* ${booking.notes}` : null,
    "",
    `Review: ${getAdminBookingsUrl()}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function getBookingNotifyWhatsApp(): string {
  return process.env.BOOKING_NOTIFY_WHATSAPP ?? contact.whatsapp;
}

/** E.164 digits only, e.g. 256744320191 */
export function normalizeWhatsAppDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function toWhatsAppE164(phone: string): string {
  const digits = normalizeWhatsAppDigits(phone);
  return `+${digits}`;
}
