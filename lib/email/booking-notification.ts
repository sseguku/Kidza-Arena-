import { buildBookingNotificationText, getAdminBookingsUrl } from "@/lib/notifications/booking-summary";
import { Resend } from "resend";
import { contact } from "@/lib/constants/contact";
import { formatTimeLabel } from "@/lib/booking/constants";
import { formatUGX } from "@/lib/booking/pricing";
import type { BookingRecord } from "@/types/booking";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getNotifyEmail(): string {
  return process.env.BOOKING_NOTIFY_EMAIL ?? contact.email;
}

function getFromEmail(): string {
  return (
    process.env.BOOKING_EMAIL_FROM ??
    "Kidza Arena <onboarding@resend.dev>"
  );
}

function buildBookingEmailContent(booking: BookingRecord) {
  const hour = parseInt(booking.start_time.split(":")[0] ?? "0", 10);
  const minute = parseInt(booking.start_time.split(":")[1] ?? "0", 10);
  const timeLabel = formatTimeLabel(hour, minute);
  const text = buildBookingNotificationText(booking).replace(/\*/g, "");

  const html = `
    <h2>New booking request</h2>
    <p>A new pitch booking is <strong>pending approval</strong>.</p>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      <tr><td style="padding:4px 12px 4px 0;color:#666">Customer</td><td><strong>${booking.full_name}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Phone</td><td>${booking.phone}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td>${booking.email}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Session</td><td>${booking.booking_type} · ${booking.booking_date} · ${timeLabel} (${booking.duration_hours}h)</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Price</td><td>${formatUGX(booking.price_ugx)}</td></tr>
      ${booking.team_name ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Team</td><td>${booking.team_name}</td></tr>` : ""}
      ${booking.notes ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Notes</td><td>${booking.notes}</td></tr>` : ""}
    </table>
    <p style="margin-top:24px">
      <a href="${getAdminBookingsUrl()}" style="background:#117a3d;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">
        Review in admin dashboard
      </a>
    </p>
  `;

  return { text, html, subject: `New booking request — ${booking.full_name} · ${booking.booking_date}` };
}

export async function sendNewBookingNotification(
  booking: BookingRecord,
): Promise<{ sent: boolean; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY not set — skipping booking notification email",
    );
    return { sent: false, error: "Email not configured" };
  }

  const { subject, text, html } = buildBookingEmailContent(booking);

  try {
    const { error } = await resend.emails.send({
      from: getFromEmail(),
      to: [getNotifyEmail()],
      subject,
      text,
      html,
    });

    if (error) {
      console.warn("[email] booking notification failed:", error.message);
      return { sent: false, error: error.message };
    }

    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[email] booking notification error:", message);
    return { sent: false, error: message };
  }
}
