import { getAdminDataClient, normalizeTimeValue } from "@/lib/supabase/admin-data";
import type { BlockedSlot, RecurringBooking } from "@/types/availability";
import { durationMinutesFromTimes } from "@/lib/booking/availability";

export async function listAllRecurringBookings(): Promise<RecurringBooking[]> {
  const supabase = await getAdminDataClient();
  const { data, error } = await supabase
    .from("recurring_bookings")
    .select("*")
    .order("team_name")
    .order("day_of_week");

  if (error) {
    console.warn("[admin/availability] list recurring:", error.message);
    return [];
  }

  const rows = (data ?? []) as RecurringBooking[];
  const seen = new Map<string, RecurringBooking>();
  for (const row of rows) {
    const key = `${row.day_of_week}|${row.start_time}|${row.end_time}|${row.team_name}`;
    if (!seen.has(key)) seen.set(key, row);
  }
  return Array.from(seen.values());
}

export async function upsertRecurringBooking(
  input: Partial<RecurringBooking> & {
    team_name: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
  },
): Promise<{ error: string | null; data: RecurringBooking | null }> {
  const supabase = await getAdminDataClient();
  const start_time = normalizeTimeValue(input.start_time);
  const end_time = normalizeTimeValue(input.end_time);
  const duration_minutes = durationMinutesFromTimes(start_time, end_time);

  if (duration_minutes <= 0) {
    return { error: "End time must be after start time.", data: null };
  }

  const { data: existing } = await supabase
    .from("recurring_bookings")
    .select("id, team_name")
    .eq("day_of_week", input.day_of_week)
    .eq("start_time", start_time)
    .eq("end_time", end_time)
    .eq("active", true)
    .maybeSingle();

  if (existing && existing.id !== input.id) {
    return {
      error: `This time slot is already taken by ${existing.team_name}. Delete it first before assigning another team.`,
      data: null,
    };
  }

  const row = {
    id: input.id ?? existing?.id,
    team_name: input.team_name.trim(),
    booking_type: input.booking_type ?? "team",
    day_of_week: input.day_of_week,
    start_time,
    end_time,
    duration_minutes,
    recurrence_type: input.recurrence_type ?? "weekly",
    active: input.active ?? true,
    notes: input.notes ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("recurring_bookings")
    .upsert(row, { onConflict: "id" })
    .select("*")
    .single();

  if (error?.message?.includes("recurring_bookings_unique_weekly_slot")) {
    return {
      error:
        "This weekly time slot is already taken. Delete the existing slot before adding another.",
      data: null,
    };
  }

  return { error: error?.message ?? null, data: (data as RecurringBooking) ?? null };
}

export async function deleteRecurringBooking(
  id: string,
): Promise<{ error: string | null }> {
  const supabase = await getAdminDataClient();
  const { error } = await supabase.from("recurring_bookings").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function listAllBlockedSlots(): Promise<BlockedSlot[]> {
  const supabase = await getAdminDataClient();
  const { data, error } = await supabase
    .from("blocked_slots")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[admin/availability] list blocked:", error.message);
    return [];
  }

  const rows = (data ?? []) as BlockedSlot[];
  const seen = new Map<string, BlockedSlot>();
  for (const row of rows) {
    const key = row.is_recurring
      ? `r|${row.day_of_week}|${row.start_time}|${row.end_time}`
      : `d|${row.block_date}|${row.start_time}|${row.end_time}`;
    if (!seen.has(key)) seen.set(key, row);
  }
  return Array.from(seen.values());
}

export async function upsertBlockedSlot(
  input: Partial<BlockedSlot> & {
    start_time: string;
    end_time: string;
  },
): Promise<{ error: string | null; data: BlockedSlot | null }> {
  const supabase = await getAdminDataClient();
  const start_time = normalizeTimeValue(input.start_time);
  const end_time = normalizeTimeValue(input.end_time);
  const duration_minutes = durationMinutesFromTimes(start_time, end_time);

  if (duration_minutes <= 0) {
    return { error: "End time must be after start time.", data: null };
  }

  if (!input.is_recurring && !input.block_date) {
    return { error: "Please select a date for this blocked slot.", data: null };
  }

  if (input.is_recurring && input.day_of_week == null) {
    return { error: "Please select a day for the recurring block.", data: null };
  }

  let existingQuery = supabase
    .from("blocked_slots")
    .select("id, reason")
    .eq("start_time", start_time)
    .eq("end_time", end_time)
    .eq("active", true);

  if (input.is_recurring) {
    existingQuery = existingQuery
      .eq("is_recurring", true)
      .eq("day_of_week", input.day_of_week!);
  } else {
    existingQuery = existingQuery
      .eq("is_recurring", false)
      .eq("block_date", input.block_date!);
  }

  const { data: existing } = await existingQuery.maybeSingle();

  if (existing && existing.id !== input.id) {
    return {
      error: `This time is already blocked (${existing.reason ?? "Blocked"}). Delete it first to change.`,
      data: null,
    };
  }

  const row = {
    id: input.id ?? existing?.id,
    block_date: input.is_recurring ? null : input.block_date,
    day_of_week: input.is_recurring ? input.day_of_week : null,
    start_time,
    end_time,
    duration_minutes,
    reason: input.reason?.trim() || "Blocked",
    is_recurring: input.is_recurring ?? false,
    active: input.active ?? true,
  };

  const { data, error } = await supabase
    .from("blocked_slots")
    .upsert(row, { onConflict: "id" })
    .select("*")
    .single();

  if (
    error?.message?.includes("blocked_slots_unique_date_slot") ||
    error?.message?.includes("blocked_slots_unique_recurring_slot")
  ) {
    return {
      error: "This time slot is already blocked. Delete the existing block first.",
      data: null,
    };
  }

  return { error: error?.message ?? null, data: (data as BlockedSlot) ?? null };
}

export async function deleteBlockedSlot(
  id: string,
): Promise<{ error: string | null }> {
  const supabase = await getAdminDataClient();
  const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function skipRecurringOccurrence(
  recurringBookingId: string,
  overrideDate: string,
): Promise<{ error: string | null }> {
  const supabase = await getAdminDataClient();
  const { error } = await supabase.from("recurring_overrides").upsert({
    recurring_booking_id: recurringBookingId,
    override_date: overrideDate,
    action: "skip",
  });
  return { error: error?.message ?? null };
}
