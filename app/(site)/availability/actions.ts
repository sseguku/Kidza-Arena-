"use server";

import { isDateInPast } from "@/lib/booking/availability";
import {
  applyAvailabilityFilters,
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
    publicSlots[date] = slots.map(toPublicSlotDetail);
  }
  return { year: data.year, month: data.month, slotsByDate: publicSlots };
}

export async function getDayAvailabilityAction(
  date: string,
  filters?: AvailabilityFilters,
) {
  if (!date || isDateInPast(date)) {
    return { slots: [] as PublicSlotDetail[], error: "Invalid date" };
  }
  let slots = await getOccupiedSlotsForDate(date);
  if (filters) {
    slots = applyAvailabilityFilters(slots, filters);
  }
  return { slots: slots.map(toPublicSlotDetail) };
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
