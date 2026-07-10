import { createClient } from "@/lib/supabase/server";
import type { BookedSlot } from "@/lib/booking/availability";
import type { SubmitBookingInput } from "@/lib/booking/schema";
import type { BookingRecord } from "@/types/booking";

export async function fetchBookedSlotsForDate(
  date: string,
): Promise<BookedSlot[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("booking_date, start_time, duration_hours")
    .eq("booking_date", date)
    .neq("status", "cancelled");

  if (error) {
    console.warn("[bookings] fetchBookedSlotsForDate:", error.message);
    return [];
  }

  return (data ?? []) as BookedSlot[];
}

export async function insertBooking(
  input: SubmitBookingInput,
): Promise<{ data: BookingRecord | null; error: string | null }> {
  const supabase = await createClient();

  const row = {
    booking_type: input.bookingType,
    booking_date: input.date,
    start_time: input.startTime,
    duration_hours: input.durationHours,
    price_ugx: input.priceUgx,
    session_period: input.sessionPeriod,
    full_name: input.fullName,
    phone: input.phone,
    email: input.email,
    whatsapp: input.whatsapp || null,
    preferred_contact: input.preferredContact ?? null,
    player_count: input.playerCount,
    skill_level: input.skillLevel || null,
    match_type: input.matchType || null,
    team_name: input.teamName || null,
    notes: input.notes || null,
    status: "pending_approval" as const,
    payment_status: "unpaid" as const,
  };

  const { data, error } = await supabase
    .from("bookings")
    .insert(row)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as BookingRecord, error: null };
}

export async function fetchBookingById(
  id: string,
): Promise<BookingRecord | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as BookingRecord;
}
