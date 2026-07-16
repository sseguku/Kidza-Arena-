import { SLOT_END_HOUR, SLOT_START_HOUR } from "@/lib/booking/constants";
import { timeToMinutes } from "@/lib/booking/availability";
import type { PublicSlotDetail, SlotStatus } from "@/types/availability";
import { getWeekDateRange } from "@/lib/booking/dates";

export const WEEK_ROW_HEIGHT_PX = 80;
export const WEEK_HOUR_COUNT = SLOT_END_HOUR - SLOT_START_HOUR + 1;
export const WEEK_GRID_HEIGHT_PX = WEEK_HOUR_COUNT * WEEK_ROW_HEIGHT_PX;

export function timeToGridTop(time: string): number {
  const minutes = timeToMinutes(time.slice(0, 5));
  const start = SLOT_START_HOUR * 60;
  return ((minutes - start) / 60) * WEEK_ROW_HEIGHT_PX;
}

export function durationToGridHeight(startTime: string, endTime: string): number {
  const start = timeToMinutes(startTime.slice(0, 5));
  const end = timeToMinutes(endTime.slice(0, 5));
  return Math.max(((end - start) / 60) * WEEK_ROW_HEIGHT_PX, 48);
}

export function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:00 ${period}`;
}

export function getWeekHours(): number[] {
  return Array.from(
    { length: WEEK_HOUR_COUNT },
    (_, i) => SLOT_START_HOUR + i,
  );
}

export function slotOccupiesHour(slot: PublicSlotDetail, hour: number): boolean {
  const start = timeToMinutes(slot.startTime.slice(0, 5));
  const end = timeToMinutes(slot.endTime.slice(0, 5));
  const cellStart = hour * 60;
  const cellEnd = cellStart + 60;
  return start < cellEnd && cellStart < end;
}

export function isHourAvailable(
  date: string,
  hour: number,
  slots: PublicSlotDetail[],
): boolean {
  const daySlots = slots.filter((s) => s.date === date && s.status !== "cancelled");
  return !daySlots.some((s) => slotOccupiesHour(s, hour));
}

export type WeekStats = {
  occupancyPercent: number;
  totalBookings: number;
  availableHours: number;
  peakDay: string;
  peakDayCount: number;
  topTeam: string;
  topTeamCount: number;
  todaySlots: PublicSlotDetail[];
  nextAvailable: { date: string; hour: number; label: string } | null;
};

export function computeWeekStats(
  weekStart: string,
  slots: PublicSlotDetail[],
  today: string,
): WeekStats {
  const weekDates = getWeekDateRange(weekStart);
  const occupying = slots.filter(
    (s) => s.status !== "cancelled" && s.status !== "available",
  );
  const hours = getWeekHours();
  const totalCells = weekDates.length * hours.length;
  let occupiedCells = 0;

  const dayCounts = new Map<string, number>();
  const teamCounts = new Map<string, number>();

  for (const date of weekDates) {
    for (const hour of hours) {
      const taken = occupying.some(
        (s) => s.date === date && slotOccupiesHour(s, hour),
      );
      if (taken) {
        occupiedCells++;
      }
    }
    dayCounts.set(date, occupying.filter((s) => s.date === date).length);
  }

  for (const slot of occupying) {
    teamCounts.set(slot.teamName, (teamCounts.get(slot.teamName) ?? 0) + 1);
  }

  let peakDay = weekDates[0]!;
  let peakDayCount = 0;
  for (const [date, count] of dayCounts) {
    if (count > peakDayCount) {
      peakDayCount = count;
      peakDay = date;
    }
  }

  let topTeam = "—";
  let topTeamCount = 0;
  for (const [team, count] of teamCounts) {
    if (count > topTeamCount) {
      topTeamCount = count;
      topTeam = team;
    }
  }

  let nextAvailable: WeekStats["nextAvailable"] = null;
  outer: for (const date of weekDates) {
    for (const hour of hours) {
      if (isHourAvailable(date, hour, occupying)) {
        nextAvailable = {
          date,
          hour,
          label: `${date} · ${formatHourLabel(hour)}`,
        };
        break outer;
      }
    }
  }

  return {
    occupancyPercent: totalCells ? Math.round((occupiedCells / totalCells) * 100) : 0,
    totalBookings: occupying.length,
    availableHours: totalCells - occupiedCells,
    peakDay,
    peakDayCount,
    topTeam,
    topTeamCount,
    todaySlots: occupying.filter((s) => s.date === today),
    nextAvailable,
  };
}

export function bookingTypeLabel(slot: PublicSlotDetail): string {
  if (slot.source === "recurring" || slot.status === "recurring") {
    return "Recurring Booking";
  }
  if (slot.source === "block" || slot.status === "blocked") {
    return "Maintenance";
  }
  if (slot.status === "pending") {
    return "Pending Booking";
  }
  return "One-time Booking";
}

export function statusDisplayLabel(status: SlotStatus): string {
  const map: Record<SlotStatus, string> = {
    recurring: "Recurring",
    booked: "Confirmed",
    pending: "Pending",
    blocked: "Maintenance",
    cancelled: "Cancelled",
    available: "Available",
  };
  return map[status] ?? status;
}
