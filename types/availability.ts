export type SlotStatus =
  | "available"
  | "booked"
  | "pending"
  | "blocked"
  | "cancelled"
  | "recurring";

export type SlotSource = "booking" | "recurring" | "block";

export type OccupiedSlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: SlotStatus;
  source: SlotSource;
  teamName: string;
  bookingType: "individual" | "team";
  recurringBookingId?: string;
};

export type PublicSlotDetail = {
  id: string;
  teamName: string;
  date: string;
  dayLabel: string;
  startTime: string;
  endTime: string;
  startLabel: string;
  endLabel: string;
  durationMinutes: number;
  status: SlotStatus;
  bookingType: "individual" | "team";
  source: SlotSource;
};

export type RecurringBooking = {
  id: string;
  team_name: string;
  booking_type: "individual" | "team";
  day_of_week: number;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  recurrence_type: "weekly" | "monthly";
  active: boolean;
  notes: string | null;
  created_at: string;
};

export type BlockedSlot = {
  id: string;
  block_date: string | null;
  day_of_week: number | null;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  reason: string | null;
  is_recurring: boolean;
  active: boolean;
  created_at: string;
};

export type RecurringOverride = {
  id: string;
  recurring_booking_id: string;
  override_date: string;
  action: "skip" | "reschedule";
  new_start_time: string | null;
  new_end_time: string | null;
};

export type AvailabilityFilters = {
  date?: string;
  dayOfWeek?: number;
  period?: "morning" | "afternoon" | "evening" | "all";
  showAvailableOnly?: boolean;
  showBookedOnly?: boolean;
};

export type AvailabilityPreview = {
  todaySlots: OccupiedSlot[];
  weekSlots: OccupiedSlot[];
  nextAvailable: { date: string; startTime: string; endTime: string } | null;
  weekBookingCount: number;
  monthLabel: string;
};

export type MonthAvailability = {
  year: number;
  month: number;
  slotsByDate: Record<string, OccupiedSlot[]>;
};

export const SLOT_STATUS_COLORS: Record<
  SlotStatus,
  { bg: string; border: string; text: string; label: string }
> = {
  available: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/40",
    text: "text-emerald-300",
    label: "Available",
  },
  booked: {
    bg: "bg-red-500/20",
    border: "border-red-500/40",
    text: "text-red-300",
    label: "Booked",
  },
  pending: {
    bg: "bg-orange-500/20",
    border: "border-orange-500/40",
    text: "text-orange-300",
    label: "Pending",
  },
  blocked: {
    bg: "bg-zinc-500/20",
    border: "border-zinc-500/40",
    text: "text-zinc-300",
    label: "Blocked",
  },
  cancelled: {
    bg: "bg-zinc-400/10",
    border: "border-zinc-400/30",
    text: "text-zinc-400",
    label: "Cancelled",
  },
  recurring: {
    bg: "bg-red-500/20",
    border: "border-red-500/40",
    text: "text-red-300",
    label: "Recurring team",
  },
};

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
