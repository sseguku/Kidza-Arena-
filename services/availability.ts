import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { getAvailabilityReadClient } from "@/lib/supabase/availability-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { addDaysToDate } from "@/lib/booking/dates";
import {
  getDayOfWeek,
  timeToMinutes,
  minutesToTime,
  isDateInPast,
  getNextAvailableSlots,
  filterSlotsByPeriod,
} from "@/lib/booking/availability";
import { SLOT_END_HOUR, SLOT_START_HOUR, formatTimeLabel } from "@/lib/booking/constants";
import type {
  AvailabilityFilters,
  AvailabilityPreview,
  BlockedSlot,
  MonthAvailability,
  OccupiedSlot,
  PublicSlotDetail,
  RecurringBooking,
  RecurringOverride,
  SlotStatus,
} from "@/types/availability";
import { DAY_NAMES } from "@/types/availability";
import type { BookingRecord } from "@/types/booking";

async function getClient() {
  if (!isSupabaseConfigured()) return null;
  noStore();
  return getAvailabilityReadClient();
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return String(error);
}

/** Run a Supabase query without throwing — returns fallback on network or DB errors. */
async function safeQuery<T>(
  label: string,
  query: (
    supabase: NonNullable<Awaited<ReturnType<typeof getClient>>>,
  ) => PromiseLike<{ data: unknown; error: unknown }>,
  fallback: T,
): Promise<T> {
  try {
    const supabase = await getClient();
    if (!supabase) {
      console.warn(`[availability] ${label}: Supabase client unavailable`);
      return fallback;
    }
    const { data, error } = await query(supabase);
    if (error) {
      console.warn(`[availability] ${label}:`, getErrorMessage(error));
      return fallback;
    }
    return (data ?? fallback) as T;
  } catch (error) {
    console.warn(`[availability] ${label}:`, getErrorMessage(error));
    return fallback;
  }
}

function normalizeTime(t: string): string {
  return t.slice(0, 5);
}

function normalizeDate(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

function bookingToOccupied(b: BookingRecord): OccupiedSlot | null {
  if (b.status === "pending_approval") return null;

  const start = normalizeTime(b.start_time);
  const endMin = timeToMinutes(start) + b.duration_hours * 60;
  let status: SlotStatus = "booked";
  if (b.status === "cancelled") status = "cancelled";

  return {
    id: b.id,
    date: b.booking_date,
    startTime: start,
    endTime: minutesToTime(endMin),
    durationMinutes: b.duration_hours * 60,
    status,
    source: "booking",
    teamName:
      b.team_name ||
      (b.booking_type === "individual" ? "Individual Play" : b.full_name),
    bookingType: b.booking_type,
  };
}

function recurringToOccupied(
  r: RecurringBooking,
  date: string,
  override?: RecurringOverride,
): OccupiedSlot | null {
  if (override?.action === "skip") return null;

  const start = override?.new_start_time
    ? normalizeTime(override.new_start_time)
    : normalizeTime(r.start_time);
  const end = override?.new_end_time
    ? normalizeTime(override.new_end_time)
    : normalizeTime(r.end_time);

  return {
    id: `recurring-${r.id}-${date}`,
    date,
    startTime: start,
    endTime: end,
    durationMinutes: timeToMinutes(end) - timeToMinutes(start),
    status: "recurring",
    source: "recurring",
    teamName: r.team_name,
    bookingType: r.booking_type,
    recurringBookingId: r.id,
  };
}

function blockToOccupied(b: BlockedSlot, date: string): OccupiedSlot {
  return {
    id: `block-${b.id}-${date}`,
    date,
    startTime: normalizeTime(b.start_time),
    endTime: normalizeTime(b.end_time),
    durationMinutes: b.duration_minutes,
    status: "blocked",
    source: "block",
    teamName: b.reason ?? "Blocked",
    bookingType: "team",
  };
}

function slotDedupeKey(slot: OccupiedSlot): string {
  return [
    slot.date,
    slot.startTime,
    slot.endTime,
    slot.teamName,
    slot.status,
    slot.source,
  ].join("|");
}

function dedupeOccupiedSlots(slots: OccupiedSlot[]): OccupiedSlot[] {
  const seen = new Map<string, OccupiedSlot>();
  for (const slot of slots) {
    const key = slotDedupeKey(slot);
    if (!seen.has(key)) seen.set(key, slot);
  }
  return Array.from(seen.values()).sort(
    (a, b) =>
      a.startTime.localeCompare(b.startTime) ||
      a.teamName.localeCompare(b.teamName),
  );
}

function mergeOverlapping(slots: OccupiedSlot[]): OccupiedSlot[] {
  return dedupeOccupiedSlots(slots);
}

export const fetchRecurringBookings = cache(async (): Promise<RecurringBooking[]> => {
  const rows = await safeQuery(
    "fetchRecurringBookings",
    (supabase) =>
      supabase
        .from("recurring_bookings")
        .select("*")
        .eq("active", true),
    [] as RecurringBooking[],
  );

  const seen = new Map<string, RecurringBooking>();
  for (const row of rows) {
    const key = `${row.day_of_week}|${row.start_time}|${row.end_time}`;
    if (!seen.has(key)) seen.set(key, row);
  }
  return Array.from(seen.values());
});

export const fetchBlockedSlots = cache(async (): Promise<BlockedSlot[]> => {
  const rows = await safeQuery(
    "fetchBlockedSlots",
    (supabase) => supabase.from("blocked_slots").select("*").eq("active", true),
    [] as BlockedSlot[],
  );

  const seen = new Map<string, BlockedSlot>();
  for (const row of rows) {
    const key = row.is_recurring
      ? `r|${row.day_of_week}|${row.start_time}|${row.end_time}`
      : `d|${row.block_date}|${row.start_time}|${row.end_time}`;
    if (!seen.has(key)) seen.set(key, row);
  }
  return Array.from(seen.values());
});

export const fetchRecurringOverrides = cache(
  async (startDate: string, endDate: string): Promise<RecurringOverride[]> => {
    return safeQuery(
      "fetchRecurringOverrides",
      (supabase) =>
        supabase
          .from("recurring_overrides")
          .select("*")
          .gte("override_date", startDate)
          .lte("override_date", endDate),
      [] as RecurringOverride[],
    );
  },
);

async function fetchBookingsForRange(
  startDate: string,
  endDate: string,
): Promise<BookingRecord[]> {
  return safeQuery(
    "fetchBookingsForRange",
    (supabase) =>
      supabase
        .from("bookings")
        .select("*")
        .gte("booking_date", startDate)
        .lte("booking_date", endDate)
        .eq("status", "confirmed"),
    [] as BookingRecord[],
  );
}

export async function getOccupiedSlotsForDate(
  date: string,
  options?: { includeCancelled?: boolean; includePast?: boolean },
): Promise<OccupiedSlot[]> {
  if (!date || (!options?.includePast && isDateInPast(date))) return [];

  try {
    const dow = getDayOfWeek(date);
    const [recurring, blocks, overrides, bookings] = await Promise.all([
      fetchRecurringBookings(),
      fetchBlockedSlots(),
      fetchRecurringOverrides(date, date),
      fetchBookingsForRange(date, date),
    ]);

    const overrideMap = new Map(
      overrides.map((o) => [o.recurring_booking_id, o]),
    );

    const slots: OccupiedSlot[] = [];

    for (const b of bookings) {
      const slot = bookingToOccupied(b);
      if (slot && (slot.status !== "cancelled" || options?.includeCancelled)) {
        slots.push(slot);
      }
    }

    for (const r of recurring) {
      if (r.day_of_week === dow) {
        const slot = recurringToOccupied(r, date, overrideMap.get(r.id));
        if (slot) slots.push(slot);
      }
    }

    for (const b of blocks) {
      if (b.is_recurring && b.day_of_week === dow) {
        slots.push(blockToOccupied(b, date));
      } else if (normalizeDate(b.block_date) === date) {
        slots.push(blockToOccupied(b, date));
      }
    }

    return mergeOverlapping(slots);
  } catch (error) {
    console.warn("[availability] getOccupiedSlotsForDate:", getErrorMessage(error));
    return [];
  }
}

export const getMonthAvailability = cache(
  async (year: number, month: number): Promise<MonthAvailability> => {
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    try {
      const [recurring, blocks, overrides, bookings] = await Promise.all([
        fetchRecurringBookings(),
        fetchBlockedSlots(),
        fetchRecurringOverrides(start, end),
        fetchBookingsForRange(start, end),
      ]);

      const slotsByDate: Record<string, OccupiedSlot[]> = {};

      for (let day = 1; day <= lastDay; day++) {
        const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dow = getDayOfWeek(date);
        const dayOverrides = overrides.filter((o) => o.override_date === date);
        const overrideMap = new Map(
          dayOverrides.map((o) => [o.recurring_booking_id, o]),
        );

        const daySlots: OccupiedSlot[] = [];

        if (!isDateInPast(date)) {
          for (const b of bookings.filter((bk) => bk.booking_date === date)) {
            const slot = bookingToOccupied(b);
            if (slot) daySlots.push(slot);
          }
        }

        for (const r of recurring) {
          if (r.day_of_week === dow) {
            const slot = recurringToOccupied(r, date, overrideMap.get(r.id));
            if (slot) daySlots.push(slot);
          }
        }

        for (const bl of blocks) {
          if (bl.is_recurring && bl.day_of_week === dow) {
            daySlots.push(blockToOccupied(bl, date));
          } else if (normalizeDate(bl.block_date) === date) {
            daySlots.push(blockToOccupied(bl, date));
          }
        }

        slotsByDate[date] = mergeOverlapping(daySlots);
      }

      return { year, month, slotsByDate };
    } catch (error) {
      console.warn("[availability] getMonthAvailability:", getErrorMessage(error));
      return { year, month, slotsByDate: {} };
    }
  },
);

export async function getOccupiedSlotsForRange(
  startDate: string,
  endDate: string,
): Promise<OccupiedSlot[]> {
  try {
    const monthData = await getMonthAvailability(
      parseInt(startDate.slice(0, 4), 10),
      parseInt(startDate.slice(5, 7), 10),
    );

    const all: OccupiedSlot[] = [];
    for (const [date, slots] of Object.entries(monthData.slotsByDate)) {
      if (date >= startDate && date <= endDate) {
        all.push(...slots);
      }
    }

    if (startDate.slice(0, 7) !== endDate.slice(0, 7)) {
      const month2 = await getMonthAvailability(
        parseInt(endDate.slice(0, 4), 10),
        parseInt(endDate.slice(5, 7), 10),
      );
      for (const [date, slots] of Object.entries(month2.slotsByDate)) {
        if (date >= startDate && date <= endDate) {
          all.push(...slots);
        }
      }
    }

    return all.sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
    );
  } catch (error) {
    console.warn("[availability] getOccupiedSlotsForRange:", getErrorMessage(error));
    return [];
  }
}

export function excludePendingFromDisplay<T extends { status: SlotStatus }>(
  slots: T[],
): T[] {
  return slots.filter((s) => s.status !== "pending");
}

export function toPublicSlotDetail(slot: OccupiedSlot): PublicSlotDetail {
  const hour = parseInt(slot.startTime.split(":")[0] ?? "0", 10);
  const endHour = parseInt(slot.endTime.split(":")[0] ?? "0", 10);
  const endMin = parseInt(slot.endTime.split(":")[1] ?? "0", 10);
  const dow = getDayOfWeek(slot.date);

  return {
    id: slot.id,
    teamName: slot.teamName,
    date: slot.date,
    dayLabel: DAY_NAMES[dow] ?? "",
    startTime: slot.startTime,
    endTime: slot.endTime,
    startLabel: formatTimeLabel(hour, parseInt(slot.startTime.split(":")[1] ?? "0", 10)),
    endLabel: formatTimeLabel(endHour, endMin),
    durationMinutes: slot.durationMinutes,
    status: slot.status,
    bookingType: slot.bookingType,
    source: slot.source,
  };
}

export function applyAvailabilityFilters(
  slots: OccupiedSlot[],
  filters: AvailabilityFilters,
): OccupiedSlot[] {
  let result = [...slots];

  if (filters.dayOfWeek !== undefined) {
    result = result.filter((s) => getDayOfWeek(s.date) === filters.dayOfWeek);
  }

  if (filters.period && filters.period !== "all") {
    result = filterSlotsByPeriod(result, filters.period);
  }

  if (filters.showBookedOnly) {
    result = result.filter((s) => s.status !== "available");
  }

  return result;
}

export async function getAvailabilityPreview(): Promise<AvailabilityPreview> {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]!;
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekEndStr = weekEnd.toISOString().split("T")[0]!;

  try {
    const [todaySlots, weekSlots, monthData] = await Promise.all([
      getOccupiedSlotsForDate(todayStr),
      getOccupiedSlotsForRange(todayStr, weekEndStr),
      getMonthAvailability(year, month),
    ]);

    const occupiedByDate = new Map<string, OccupiedSlot[]>(
      Object.entries(monthData.slotsByDate),
    );

    const nextSlots = getNextAvailableSlots(todayStr, 1, occupiedByDate, 1);

    return {
      todaySlots: excludePendingFromDisplay(todaySlots),
      weekSlots: excludePendingFromDisplay(weekSlots),
      nextAvailable: nextSlots[0] ?? null,
      weekBookingCount: excludePendingFromDisplay(weekSlots).filter(
        (s) => s.status !== "blocked",
      ).length,
      monthLabel: today.toLocaleDateString("en-UG", {
        month: "long",
        year: "numeric",
      }),
    };
  } catch (error) {
    console.warn("[availability] getAvailabilityPreview:", getErrorMessage(error));
    return {
      todaySlots: [],
      weekSlots: [],
      nextAvailable: null,
      weekBookingCount: 0,
      monthLabel: today.toLocaleDateString("en-UG", {
        month: "long",
        year: "numeric",
      }),
    };
  }
}

export async function suggestNextAvailableSlots(
  date: string,
  durationHours: number,
  count = 3,
): Promise<{ date: string; startTime: string; endTime: string; label: string }[]> {
  try {
    const month = parseInt(date.slice(5, 7), 10);
    const year = parseInt(date.slice(0, 4), 10);
    const monthData = await getMonthAvailability(year, month);
    const nextMonth =
      month === 12
        ? await getMonthAvailability(year + 1, 1)
        : await getMonthAvailability(year, month + 1);

    const occupiedByDate = new Map<string, OccupiedSlot[]>([
      ...Object.entries(monthData.slotsByDate),
      ...Object.entries(nextMonth.slotsByDate),
    ]);

    return getNextAvailableSlots(date, durationHours, occupiedByDate, count).map(
      (s) => {
        const hour = parseInt(s.startTime.split(":")[0] ?? "0", 10);
        const endHour = parseInt(s.endTime.split(":")[0] ?? "0", 10);
        return {
          ...s,
          label: `${s.date} · ${formatTimeLabel(hour)} – ${formatTimeLabel(endHour)}`,
        };
      },
    );
  } catch (error) {
    console.warn("[availability] suggestNextAvailableSlots:", getErrorMessage(error));
    return [];
  }
}

export async function getWeekSlots(weekStartDate: string): Promise<OccupiedSlot[]> {
  return getOccupiedSlotsForRange(weekStartDate, addDaysToDate(weekStartDate, 6));
}

export function getHourlyGrid(): string[] {
  const slots: string[] = [];
  for (let h = SLOT_START_HOUR; h <= SLOT_END_HOUR; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
  }
  return slots;
}
