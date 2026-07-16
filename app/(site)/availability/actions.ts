"use server";

import {
  applyAvailabilityFilters,
  excludePendingFromDisplay,
  getAvailabilityPreview,
  getMonthAvailability,
  getOccupiedSlotsForDate,
  getWeekSlots,
  suggestNextAvailableSlots,
  toPublicSlotDetail,
} from "@/services/availability";
import type { AvailabilityFilters, PublicSlotDetail } from "@/types/availability";

export async function getAvailabilityPreviewAction() {
  return getAvailabilityPreview();
}

export async function getMonthAvailabilityAction(year: number, month: number) {
  const data = await getMonthAvailability(year, month);
  const publicSlots: Record<string, PublicSlotDetail[]> = {};
  for (const [date, slots] of Object.entries(data.slotsByDate)) {
    publicSlots[date] = excludePendingFromDisplay(slots).map(toPublicSlotDetail);
  }
  return { year: data.year, month: data.month, slotsByDate: publicSlots };
}

export async function getDayAvailabilityAction(
  date: string,
  filters?: AvailabilityFilters,
) {
  if (!date) {
    return { slots: [] as PublicSlotDetail[], error: "Invalid date" };
  }
  let slots = await getOccupiedSlotsForDate(date, { includePast: true });
  if (filters) {
    const { dayOfWeek: _dayOfWeek, date: _date, ...dayFilters } = filters;
    slots = applyAvailabilityFilters(slots, dayFilters);
  }
  return { slots: excludePendingFromDisplay(slots).map(toPublicSlotDetail) };
}

export async function getWeekAvailabilityAction(weekStart: string) {
  const slots = await getWeekSlots(weekStart);
  return { slots: slots.map(toPublicSlotDetail) };
}

export async function suggestSlotsAction(
  date: string,
  durationHours: number,
) {
  return suggestNextAvailableSlots(date, durationHours, 3);
}
