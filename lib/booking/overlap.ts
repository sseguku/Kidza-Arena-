import { rangesOverlapMinutes, timeToMinutes } from "@/lib/booking/availability";

export type BookingTimeSlot = {
  booking_date: string;
  start_time: string;
  duration_hours: number;
};

export function bookingTimeRange(slot: BookingTimeSlot): {
  start: number;
  end: number;
} {
  const start = timeToMinutes(slot.start_time.slice(0, 5));
  return { start, end: start + slot.duration_hours * 60 };
}

export function bookingsOverlap(a: BookingTimeSlot, b: BookingTimeSlot): boolean {
  if (a.booking_date !== b.booking_date) return false;
  const rangeA = bookingTimeRange(a);
  const rangeB = bookingTimeRange(b);
  return rangesOverlapMinutes(rangeA.start, rangeA.end, rangeB.start, rangeB.end);
}

export function bookingSlotKey(slot: BookingTimeSlot): string {
  return `${slot.booking_date}|${slot.start_time.slice(0, 5)}|${slot.duration_hours}`;
}
