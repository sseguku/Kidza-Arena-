import { getAdminDataClient } from "@/lib/supabase/admin-data";
import type { BookingStats } from "@/types/admin";
import type { BookingRecord } from "@/types/booking";

export async function getBookingStats(): Promise<BookingStats> {
  const supabase = await getAdminDataClient();
  const { data, error } = await supabase.from("bookings").select("*");

  if (error || !data) {
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      revenuePaid: 0,
      revenuePending: 0,
      todayBookings: 0,
      thisWeekBookings: 0,
    };
  }

  const bookings = data as BookingRecord[];
  const today = new Date().toISOString().split("T")[0]!;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStart = weekAgo.toISOString().split("T")[0]!;

  return {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending_approval").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    revenuePaid: bookings
      .filter((b) => b.payment_status === "paid")
      .reduce((sum, b) => sum + b.price_ugx, 0),
    revenuePending: bookings
      .filter((b) => b.payment_status === "unpaid" && b.status !== "cancelled")
      .reduce((sum, b) => sum + b.price_ugx, 0),
    todayBookings: bookings.filter((b) => b.booking_date === today).length,
    thisWeekBookings: bookings.filter((b) => b.booking_date >= weekStart).length,
  };
}

export type MonthlyRevenue = { month: string; revenue: number; count: number };

export async function getMonthlyRevenue(months = 6): Promise<MonthlyRevenue[]> {
  const supabase = await getAdminDataClient();
  const { data } = await supabase
    .from("bookings")
    .select("booking_date, price_ugx, payment_status, status")
    .eq("payment_status", "paid")
    .neq("status", "cancelled");

  const result: MonthlyRevenue[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-UG", { month: "short", year: "2-digit" });

    const monthBookings = (data ?? []).filter((b) =>
      b.booking_date.startsWith(key),
    );

    result.push({
      month: label,
      revenue: monthBookings.reduce((s, b) => s + b.price_ugx, 0),
      count: monthBookings.length,
    });
  }

  return result;
}

export type BookingTypeBreakdown = { type: string; count: number };

export async function getBookingTypeBreakdown(): Promise<BookingTypeBreakdown[]> {
  const supabase = await getAdminDataClient();
  const { data } = await supabase.from("bookings").select("booking_type, status");

  const rows = (data ?? []).filter((b) => b.status !== "cancelled");
  const individual = rows.filter((b) => b.booking_type === "individual").length;
  const team = rows.filter((b) => b.booking_type === "team").length;

  return [
    { type: "Individual", count: individual },
    { type: "Team", count: team },
  ];
}
