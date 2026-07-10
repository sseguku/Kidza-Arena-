import type { UserRole } from "@/types/database";

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
};

export type AdminSession = {
  userId: string;
  email: string;
  profile: AdminProfile;
};

export type PricingSettings = {
  individualPriceUgx: number;
  teamHourlyPriceUgx: number;
  currency: string;
};

export type GeneralSettings = {
  siteName: string;
  bookingApprovalRequired: boolean;
  maintenanceMode: boolean;
};

export type BookingStats = {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  revenuePaid: number;
  revenuePending: number;
  todayBookings: number;
  thisWeekBookings: number;
};

export type MediaAsset = {
  id: string;
  title: string;
  url: string;
  type: "image" | "video";
  category: string | null;
  alt_text: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

export type AcademyProgram = {
  id: string;
  title: string;
  description: string | null;
  age_group: string | null;
  schedule: string | null;
  price_ugx: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type Tournament = {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  format: string | null;
  prize_ugx: number | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  max_teams: number | null;
  is_published: boolean;
  created_at: string;
};
