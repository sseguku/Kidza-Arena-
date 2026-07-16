import { getAdminDataClient } from "@/lib/supabase/admin-data";
import { bookingsOverlap } from "@/lib/booking/overlap";
import type { BookingRecord } from "@/types/booking";
import type { BookingStatus, PaymentStatus } from "@/types/database";

export type BookingFilters = {
  status?: BookingStatus | "all";
  payment?: PaymentStatus | "all";
  search?: string;
  limit?: number;
};

export async function listBookings(
  filters: BookingFilters = {},
): Promise<BookingRecord[]> {
  const supabase = await getAdminDataClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.payment && filters.payment !== "all") {
    query = query.eq("payment_status", filters.payment);
  }
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("[admin] listBookings:", error.message);
    return [];
  }

  let rows = (data ?? []) as BookingRecord[];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter(
      (b) =>
        b.full_name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        (b.team_name?.toLowerCase().includes(q) ?? false),
    );
  }

  return rows;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<{ error: string | null }> {
  const supabase = await getAdminDataClient();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !booking) {
    return { error: fetchError?.message ?? "Booking not found" };
  }

  const record = booking as BookingRecord;

  if (status === "confirmed") {
    const { data: confirmedRows } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_date", record.booking_date)
      .eq("status", "confirmed")
      .neq("id", id);

    const hasConfirmedConflict = ((confirmedRows ?? []) as BookingRecord[]).some(
      (row) => bookingsOverlap(record, row),
    );

    if (hasConfirmedConflict) {
      return {
        error:
          "This slot is already confirmed for another booking. Decline this request instead.",
      };
    }
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message ?? null };
  }

  if (status === "confirmed") {
    const { data: pendingRows } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_date", record.booking_date)
      .eq("status", "pending_approval")
      .neq("id", id);

    const competingIds = ((pendingRows ?? []) as BookingRecord[])
      .filter((row) => bookingsOverlap(record, row))
      .map((row) => row.id);

    if (competingIds.length > 0) {
      await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .in("id", competingIds);
    }
  }

  return { error: null };
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus,
): Promise<{ error: string | null }> {
  const supabase = await getAdminDataClient();
  const { error } = await supabase
    .from("bookings")
    .update({ payment_status: paymentStatus })
    .eq("id", id);

  return { error: error?.message ?? null };
}

export async function getBookingsForMonth(
  year: number,
  month: number,
): Promise<BookingRecord[]> {
  const supabase = await getAdminDataClient();
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .gte("booking_date", start)
    .lte("booking_date", end)
    .neq("status", "cancelled")
    .order("booking_date")
    .order("start_time");

  if (error) return [];
  return (data ?? []) as BookingRecord[];
}

/** How many pending requests share the same slot window (including this booking). */
export function countCompetingPendingBookings(
  bookings: BookingRecord[],
): Map<string, number> {
  const pending = bookings.filter((b) => b.status === "pending_approval");
  const counts = new Map<string, number>();

  for (const booking of pending) {
    const total = pending.filter((other) => bookingsOverlap(booking, other)).length;
    if (total > 1) {
      counts.set(booking.id, total);
    }
  }

  return counts;
}
