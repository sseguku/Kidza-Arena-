import { getAdminClient } from "@/lib/auth/session";
import type { BlockedSlot, RecurringBooking } from "@/types/availability";
import { durationMinutesFromTimes } from "@/lib/booking/availability";

export async function listAllRecurringBookings(): Promise<RecurringBooking[]> {
  const { supabase } = await getAdminClient();
  const { data } = await supabase
    .from("recurring_bookings")
    .select("*")
    .order("team_name")
    .order("day_of_week");
  return (data ?? []) as RecurringBooking[];
}

export async function upsertRecurringBooking(
  input: Partial<RecurringBooking> & {
    team_name: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
  },
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const duration_minutes = durationMinutesFromTimes(
    input.start_time,
    input.end_time,
  );
  const { error } = await supabase.from("recurring_bookings").upsert({
    ...input,
    duration_minutes,
    updated_at: new Date().toISOString(),
  });
  return { error: error?.message ?? null };
}

export async function deleteRecurringBooking(
  id: string,
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const { error } = await supabase.from("recurring_bookings").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function listAllBlockedSlots(): Promise<BlockedSlot[]> {
  const { supabase } = await getAdminClient();
  const { data } = await supabase
    .from("blocked_slots")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as BlockedSlot[];
}

export async function upsertBlockedSlot(
  input: Partial<BlockedSlot> & {
    start_time: string;
    end_time: string;
  },
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const duration_minutes = durationMinutesFromTimes(
    input.start_time,
    input.end_time,
  );
  const { error } = await supabase.from("blocked_slots").upsert({
    ...input,
    duration_minutes,
  });
  return { error: error?.message ?? null };
}

export async function deleteBlockedSlot(
  id: string,
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function skipRecurringOccurrence(
  recurringBookingId: string,
  overrideDate: string,
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const { error } = await supabase.from("recurring_overrides").upsert({
    recurring_booking_id: recurringBookingId,
    override_date: overrideDate,
    action: "skip",
  });
  return { error: error?.message ?? null };
}
