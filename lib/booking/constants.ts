import type { MatchType } from "@/types/booking";

export const BOOKING_STORAGE_KEY = "kidza-arena-booking-draft";

export const INDIVIDUAL_PRICE_UGX = 10_000;
export const TEAM_HOURLY_PRICE_UGX = 80_000;

export const BOOKING_STEPS = [
  { id: 1, label: "Type", short: "Type" },
  { id: 2, label: "Schedule", short: "Schedule" },
  { id: 3, label: "Contact", short: "Contact" },
  { id: 4, label: "Details", short: "Details" },
  { id: 5, label: "Review", short: "Review" },
  { id: 6, label: "Done", short: "Done" },
] as const;

export const TOTAL_STEPS = 6;

/** Operating hours — arena is 24/7 but slots shown 06:00–23:00 */
export const SLOT_START_HOUR = 6;
export const SLOT_END_HOUR = 23;

export const DURATION_OPTIONS = {
  individual: [1] as const,
  team: [1, 2, 3] as const,
};

export const MATCH_TYPE_OPTIONS: { value: MatchType; label: string }[] = [
  { value: "friendly", label: "Friendly" },
  { value: "training", label: "Training" },
  { value: "tournament", label: "Tournament" },
  { value: "corporate_event", label: "Corporate Event" },
  { value: "birthday_party", label: "Birthday Party" },
];

export const SKILL_LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "any", label: "Any / Open Level" },
] as const;

export const DAY_PERIOD_END_HOUR = 18;

export function formatTimeLabel(hour: number, minute = 0): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, "0");
  return `${h}:${m} ${period}`;
}

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = SLOT_START_HOUR; h <= SLOT_END_HOUR; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
  }
  return slots;
}

export const TIME_SLOTS = generateTimeSlots();
