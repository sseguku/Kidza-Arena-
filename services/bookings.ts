import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mapBookingDbError } from "@/lib/supabase/errors";
import type { BookedSlot } from "@/lib/booking/availability";
import type { SubmitBookingInput } from "@/lib/booking/schema";
import type { BookingRecord } from "@/types/booking";

function toBookingPayload(input: SubmitBookingInput) {
  return {
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
}

export async function fetchBookedSlotsForDate(
  date: string,
): Promise<BookedSlot[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("booking_date, start_time, duration_hours")
    .eq("booking_date", date)
    .eq("status", "confirmed");

  if (error) {
    console.warn("[bookings] fetchBookedSlotsForDate:", error.message);
    return [];
  }

  return (data ?? []) as BookedSlot[];
}

export async function insertBooking(
  input: SubmitBookingInput,
): Promise<{ data: BookingRecord | null; error: string | null }> {
  const payload = toBookingPayload(input);
  const supabase = await createClient();

  const { data: bookingId, error: rpcError } = await supabase.rpc(
    "submit_booking_request",
    { payload },
  );

  if (!rpcError && bookingId) {
    const saved = await fetchBookingById(String(bookingId));
    return {
      data: saved ?? ({ id: String(bookingId) } as BookingRecord),
      error: null,
    };
  }

  const admin = createSupabaseAdminClient();
  if (admin) {
    const { data, error } = await admin
      .from("bookings")
      .insert(payload)
      .select("*")
      .single();

    if (!error && data) {
      return { data: data as BookingRecord, error: null };
    }

    if (error) {
      return { data: null, error: mapBookingDbError(error.message) };
    }
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return { data: null, error: mapBookingDbError(error.message) };
  }

  return { data: data as BookingRecord, error: null };
}

export async function fetchBookingById(
  id: string,
): Promise<BookingRecord | null> {
  const admin = createSupabaseAdminClient();
  const supabase = admin ?? (await createClient());

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as BookingRecord;
}
