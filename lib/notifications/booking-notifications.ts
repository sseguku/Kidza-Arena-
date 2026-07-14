import { sendNewBookingNotification } from "@/lib/email/booking-notification";
import { sendWhatsAppBookingNotification } from "@/lib/notifications/whatsapp";
import type { BookingRecord } from "@/types/booking";

/** Fire-and-forget admin alerts for a new booking (email + WhatsApp). */
export async function notifyAdminsOfNewBooking(booking: BookingRecord): Promise<void> {
  await Promise.allSettled([
    sendNewBookingNotification(booking),
    sendWhatsAppBookingNotification(booking),
  ]);
}
