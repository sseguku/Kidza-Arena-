import { SLOT_END_HOUR, SLOT_START_HOUR } from "@/lib/booking/constants";
import type { OccupiedSlot, SlotStatus } from "@/types/availability";

export type BookedSlot = {
  booking_date: string;
  start_time: string;
  duration_hours: number;
};

/** Parse "HH:MM" or "HH:MM:SS" to minutes from midnight */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function durationMinutesFromTimes(start: string, end: string): number {
  return timeToMinutes(end) - timeToMinutes(start);
}

export function getDayOfWeek(date: string): number {
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(y!, mo! - 1, d!).getDay();
}

export function rangesOverlapMinutes(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
): boolean {
  return startA < endB && startB < endA;
}

export function rangesOverlap(
  startA: number,
  durationA: number,
  startB: number,
  durationB: number,
): boolean {
  const endA = startA + durationA * 60;
  const endB = startB + durationB * 60;
  return rangesOverlapMinutes(startA, endA, startB, endB);
}

export function occupiedToBookedSlots(slots: OccupiedSlot[]): BookedSlot[] {
  return slots
    .filter((s) => s.status !== "cancelled" && s.status !== "available")
    .map((s) => ({
      booking_date: s.date,
      start_time: s.startTime,
      duration_hours: Math.ceil(s.durationMinutes / 60),
    }));
}

export function isOccupiedConflict(
  date: string,
  startTime: string,
  durationHours: number,
  occupied: OccupiedSlot[],
): boolean {
  const startMin = timeToMinutes(startTime);
  const endMin = startMin + durationHours * 60;
  const maxEnd = (SLOT_END_HOUR + 1) * 60;

  if (startMin < SLOT_START_HOUR * 60 || endMin > maxEnd) {
    return true;
  }

  return occupied.some((slot) => {
    if (slot.date !== date) return false;
    if (slot.status === "cancelled" || slot.status === "available") return false;
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    return rangesOverlapMinutes(startMin, endMin, slotStart, slotEnd);
  });
}

/** @deprecated Use isOccupiedConflict with OccupiedSlot[] */
export function isSlotConflict(
  date: string,
  startTime: string,
  durationHours: number,
  booked: BookedSlot[],
): boolean {
  const occupied: OccupiedSlot[] = booked.map((b, i) => ({
    id: `legacy-${i}`,
    date: b.booking_date,
    startTime: b.start_time,
    endTime: minutesToTime(
      timeToMinutes(b.start_time) + b.duration_hours * 60,
    ),
    durationMinutes: b.duration_hours * 60,
    status: "booked" as SlotStatus,
    source: "booking" as const,
    teamName: "Booked",
    bookingType: "team" as const,
  }));
  return isOccupiedConflict(date, startTime, durationHours, occupied);
}

export function isPastSlot(date: string, startTime: string): boolean {
  const now = new Date();
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = startTime.split(":").map(Number);
  const slot = new Date(y!, mo! - 1, d!, h!, mi!, 0, 0);
  return slot.getTime() <= now.getTime();
}

export function isDateInPast(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, mo, d] = date.split("-").map(Number);
  const selected = new Date(y!, mo! - 1, d!, 0, 0, 0, 0);
  return selected.getTime() < today.getTime();
}

export function getSlotStatusForTime(
  date: string,
  startTime: string,
  durationHours: number,
  occupied: OccupiedSlot[],
): SlotStatus {
  if (isPastSlot(date, startTime)) return "blocked";
  if (isOccupiedConflict(date, startTime, durationHours, occupied)) {
    const conflict = occupied.find((s) => {
      if (s.date !== date) return false;
      const startMin = timeToMinutes(startTime);
      const endMin = startMin + durationHours * 60;
      const slotStart = timeToMinutes(s.startTime);
      const slotEnd = timeToMinutes(s.endTime);
      return rangesOverlapMinutes(startMin, endMin, slotStart, slotEnd);
    });
    return conflict?.status ?? "booked";
  }
  return "available";
}

export function getUnavailableSlots(
  date: string,
  durationHours: number,
  occupied: OccupiedSlot[],
): Set<string> {
  const unavailable = new Set<string>();
  for (let h = SLOT_START_HOUR; h <= SLOT_END_HOUR; h++) {
    const slot = `${h.toString().padStart(2, "0")}:00`;
    if (
      isPastSlot(date, slot) ||
      isOccupiedConflict(date, slot, durationHours, occupied)
    ) {
      unavailable.add(slot);
    }
  }
  return unavailable;
}

export function getNextAvailableSlots(
  startDate: string,
  durationHours: number,
  occupiedByDate: Map<string, OccupiedSlot[]>,
  count = 3,
  maxDays = 30,
): { date: string; startTime: string; endTime: string }[] {
  const results: { date: string; startTime: string; endTime: string }[] = [];
  const [y, mo, d] = startDate.split("-").map(Number);
  const cursor = new Date(y!, mo! - 1, d!);

  for (let day = 0; day < maxDays && results.length < count; day++) {
    const date = cursor.toISOString().split("T")[0]!;
    if (!isDateInPast(date)) {
      const occupied = occupiedByDate.get(date) ?? [];
      for (let h = SLOT_START_HOUR; h <= SLOT_END_HOUR; h++) {
        const startTime = `${h.toString().padStart(2, "0")}:00`;
        if (
          !isPastSlot(date, startTime) &&
          !isOccupiedConflict(date, startTime, durationHours, occupied)
        ) {
          results.push({
            date,
            startTime,
            endTime: minutesToTime(timeToMinutes(startTime) + durationHours * 60),
          });
          if (results.length >= count) break;
        }
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return results;
}

export function filterSlotsByPeriod(
  slots: OccupiedSlot[],
  period: "morning" | "afternoon" | "evening" | "all",
): OccupiedSlot[] {
  if (period === "all") return slots;
  return slots.filter((slot) => {
    const hour = parseInt(slot.startTime.split(":")[0] ?? "0", 10);
    if (period === "morning") return hour >= 6 && hour < 12;
    if (period === "afternoon") return hour >= 12 && hour < 17;
    return hour >= 17;
  });
}
