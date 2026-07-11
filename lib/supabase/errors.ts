/** User-friendly Supabase / PostgREST errors for booking flows */
export function mapBookingDbError(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("could not find the table") ||
    (lower.includes("relation") && lower.includes("does not exist")) ||
    lower.includes("schema cache")
  ) {
    return "Online booking is not fully set up yet. Please call or WhatsApp us and we will reserve your slot for you.";
  }

  if (lower.includes("submit_booking_request")) {
    return "Booking could not be saved. Please try again or contact us directly.";
  }

  if (lower.includes("row-level security") || lower.includes("permission denied")) {
    return "Booking could not be saved due to a permissions issue. Please contact Kidza Arena directly.";
  }

  return "Failed to save booking. Please try again or call us.";
}
