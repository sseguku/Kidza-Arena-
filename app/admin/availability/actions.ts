"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, getAdminClient } from "@/lib/auth/session";
import {
  deleteBlockedSlot,
  deleteRecurringBooking,
  skipRecurringOccurrence,
  upsertBlockedSlot,
  upsertRecurringBooking,
} from "@/services/admin/availability";
import type { BlockedSlot, RecurringBooking } from "@/types/availability";

async function guard() {
  await requireAdmin();
}

export async function saveRecurringBookingAction(
  input: Partial<RecurringBooking> & {
    team_name: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
  },
) {
  await guard();
  const result = await upsertRecurringBooking(input);
  revalidatePath("/admin/availability");
  revalidatePath("/admin/calendar");
  revalidatePath("/availability");
  return result;
}

export async function deleteRecurringBookingAction(id: string) {
  await guard();
  const result = await deleteRecurringBooking(id);
  revalidatePath("/admin/availability");
  revalidatePath("/availability");
  return result;
}

export async function saveBlockedSlotAction(
  input: Partial<BlockedSlot> & { start_time: string; end_time: string },
) {
  await guard();
  const result = await upsertBlockedSlot(input);
  revalidatePath("/admin/availability");
  revalidatePath("/availability");
  return result;
}

export async function deleteBlockedSlotAction(id: string) {
  await guard();
  const result = await deleteBlockedSlot(id);
  revalidatePath("/admin/availability");
  return result;
}

export async function skipRecurringOccurrenceAction(
  recurringBookingId: string,
  overrideDate: string,
) {
  await guard();
  const result = await skipRecurringOccurrence(recurringBookingId, overrideDate);
  revalidatePath("/admin/availability");
  revalidatePath("/availability");
  return result;
}

export async function updateBookingDateTimeAction(
  bookingId: string,
  bookingDate: string,
  startTime: string,
  durationHours: number,
) {
  await guard();
  const { supabase } = await getAdminClient();

  const { error } = await supabase
    .from("bookings")
    .update({
      booking_date: bookingDate,
      start_time: startTime,
      duration_hours: durationHours,
    })
    .eq("id", bookingId);

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
  revalidatePath("/availability");
  return { error: error?.message ?? null };
}
