"use server";

import { revalidatePath } from "next/cache";
import {
  isDateInPast,
  isOccupiedConflict,
  isPastSlot,
} from "@/lib/booking/availability";
import { getSessionPeriod, calculateBookingPrice } from "@/lib/booking/pricing";
import { submitBookingSchema } from "@/lib/booking/schema";
import { notifyAdminsOfNewBooking } from "@/lib/notifications/booking-notifications";
import { insertBooking } from "@/services/bookings";
import {
  getOccupiedSlotsForDate,
  excludePendingFromDisplay,
  suggestNextAvailableSlots,
} from "@/services/availability";

export async function getAvailabilityAction(date: string) {
  if (!date || isDateInPast(date)) {
    return { occupied: [], error: "Invalid date" };
  }

  try {
    const occupied = excludePendingFromDisplay(
      await getOccupiedSlotsForDate(date),
    );
    return { occupied };
  } catch (e) {
    return {
      occupied: [],
      error: e instanceof Error ? e.message : "Failed to load availability",
    };
  }
}

export type SubmitBookingResult =
  | { success: true; bookingId: string }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
      suggestions?: { date: string; startTime: string; endTime: string; label: string }[];
    };

export async function submitBookingAction(
  raw: unknown,
): Promise<SubmitBookingResult> {
  const parsed = submitBookingSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return {
      success: false,
      error: "Please check your booking details",
      fieldErrors,
    };
  }

  const data = parsed.data;

  if (isDateInPast(data.date)) {
    return { success: false, error: "Cannot book dates in the past" };
  }

  if (isPastSlot(data.date, data.startTime)) {
    return { success: false, error: "Cannot book past time slots" };
  }

  const expectedPrice = calculateBookingPrice({
    bookingType: data.bookingType,
    durationHours: data.durationHours,
    playerCount: data.playerCount,
  });

  if (data.priceUgx !== expectedPrice) {
    return {
      success: false,
      error: "Price mismatch. Please refresh and try again.",
    };
  }

  const occupied = await getOccupiedSlotsForDate(data.date);

  if (isOccupiedConflict(data.date, data.startTime, data.durationHours, occupied)) {
    const suggestions = await suggestNextAvailableSlots(
      data.date,
      data.durationHours,
      3,
    );
    return {
      success: false,
      error:
        "Sorry, this time slot is already booked. Please choose another available time.",
      suggestions,
    };
  }

  const sessionPeriod = getSessionPeriod(data.startTime);

  const { data: booking, error } = await insertBooking({
    ...data,
    sessionPeriod,
  });

  if (error || !booking) {
    return {
      success: false,
      error: error ?? "Failed to save booking. Please try again or call us.",
    };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/calendar");
  revalidatePath("/availability");

  void notifyAdminsOfNewBooking(booking);

  return { success: true, bookingId: booking.id };
}
