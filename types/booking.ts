export type BookingType = "individual" | "team";

export type BookingStatus = "pending_approval" | "confirmed" | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type SessionPeriod = "day" | "night";

export type MatchType =
  | "friendly"
  | "training"
  | "tournament"
  | "corporate_event"
  | "birthday_party";

export type PreferredContact = "phone" | "email" | "whatsapp";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "any";

export type BookingFormState = {
  bookingType: BookingType | null;
  date: string;
  startTime: string;
  durationHours: number;
  sessionPeriod: SessionPeriod | null;
  fullName: string;
  phone: string;
  email: string;
  whatsapp: string;
  preferredContact: PreferredContact;
  playerCount: number;
  skillLevel: SkillLevel | "";
  teamName: string;
  matchType: MatchType | "";
  notes: string;
  termsAccepted: boolean;
};

export const initialBookingFormState: BookingFormState = {
  bookingType: null,
  date: "",
  startTime: "",
  durationHours: 1,
  sessionPeriod: null,
  fullName: "",
  phone: "",
  email: "",
  whatsapp: "",
  preferredContact: "phone",
  playerCount: 1,
  skillLevel: "",
  teamName: "",
  matchType: "",
  notes: "",
  termsAccepted: false,
};

export type BookingRecord = {
  id: string;
  created_at: string;
  booking_type: BookingType;
  booking_date: string;
  start_time: string;
  duration_hours: number;
  price_ugx: number;
  session_period: SessionPeriod;
  full_name: string;
  phone: string;
  email: string;
  whatsapp: string | null;
  preferred_contact: PreferredContact | null;
  player_count: number | null;
  skill_level: string | null;
  match_type: string | null;
  team_name: string | null;
  notes: string | null;
  status: BookingStatus;
  payment_status: PaymentStatus;
};
