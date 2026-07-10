import { getAdminClient } from "@/lib/auth/session";
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
  const { supabase } = await getAdminClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .order("booking_date", { ascending: false })
    .order("start_time", { ascending: false });

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
  const { supabase } = await getAdminClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  return { error: error?.message ?? null };
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus,
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
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
  const { supabase } = await getAdminClient();
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
