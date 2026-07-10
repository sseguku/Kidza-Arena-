import {
  INDIVIDUAL_PRICE_UGX,
  TEAM_HOURLY_PRICE_UGX,
  DAY_PERIOD_END_HOUR,
} from "@/lib/booking/constants";
import type { BookingType, SessionPeriod } from "@/types/booking";

export function getSessionPeriod(startTime: string): SessionPeriod {
  const hour = parseInt(startTime.split(":")[0] ?? "0", 10);
  return hour < DAY_PERIOD_END_HOUR ? "day" : "night";
}

export function calculateBookingPrice(params: {
  bookingType: BookingType;
  durationHours: number;
  playerCount: number;
}): number {
  if (params.bookingType === "individual") {
    return INDIVIDUAL_PRICE_UGX * Math.max(1, params.playerCount);
  }
  return TEAM_HOURLY_PRICE_UGX * Math.max(1, params.durationHours);
}

export function formatUGX(amount: number): string {
  return `UGX ${amount.toLocaleString("en-UG")}`;
}
