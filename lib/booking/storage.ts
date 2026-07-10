import { BOOKING_STORAGE_KEY } from "@/lib/booking/constants";
import type { BookingFormState } from "@/types/booking";
import { initialBookingFormState } from "@/types/booking";

export function loadBookingDraft(): BookingFormState {
  if (typeof window === "undefined") return initialBookingFormState;
  try {
    const raw = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (!raw) return initialBookingFormState;
    return { ...initialBookingFormState, ...JSON.parse(raw) };
  } catch {
    return initialBookingFormState;
  }
}

export function saveBookingDraft(state: BookingFormState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota exceeded — silently ignore */
  }
}

export function clearBookingDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BOOKING_STORAGE_KEY);
}
