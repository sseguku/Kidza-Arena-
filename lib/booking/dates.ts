/** Format a Date as YYYY-MM-DD in local timezone (not UTC). */
export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayLocalDate(): string {
  return formatLocalDate(new Date());
}

/** Parse YYYY-MM-DD to a local-midnight Date. */
export function parseLocalDate(date: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(y!, mo! - 1, d!);
}

export function addDaysToDate(date: string, days: number): string {
  const next = parseLocalDate(date);
  next.setDate(next.getDate() + days);
  return formatLocalDate(next);
}

/** Monday-based week start for the given date (local timezone). */
export function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return formatLocalDate(d);
}

export function getWeekDateRange(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDaysToDate(weekStart, i));
}

export function slotOverlapsHour(
  startTime: string,
  endTime: string,
  hour: number,
): boolean {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const slotStart = (sh ?? 0) * 60 + (sm ?? 0);
  const slotEnd = (eh ?? 0) * 60 + (em ?? 0);
  const cellStart = hour * 60;
  const cellEnd = cellStart + 60;
  return slotStart < cellEnd && cellStart < slotEnd;
}
