"use client";

import { cn } from "@/lib/utils";
import {
  addDaysToDate,
  getWeekStartDate,
  todayLocalDate,
} from "@/lib/booking/dates";
import { ChevronLeft, ChevronRight } from "lucide-react";

type WeekCalendarHeaderProps = {
  weekStart: string;
  onWeekChange: (start: string) => void;
  occupancyPercent: number;
};

function parseLocalDateKey(date: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(y!, mo! - 1, d!);
}

export function WeekCalendarHeader({
  weekStart,
  onWeekChange,
  occupancyPercent,
}: WeekCalendarHeaderProps) {
  const weekEnd = addDaysToDate(weekStart, 6);
  const startDate = parseLocalDateKey(weekStart);
  const endDate = parseLocalDateKey(weekEnd);
  const monthLabel = startDate.toLocaleDateString("en-UG", {
    month: "long",
    year: "numeric",
  });
  const weekRange = `${startDate.toLocaleDateString("en-UG", {
    month: "short",
    day: "numeric",
  })} – ${endDate.toLocaleDateString("en-UG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  const weekInputValue = weekStart;
  const monthValue = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="sticky top-0 z-40 space-y-4 border-b border-white/10 bg-[#0B0F14]/90 pb-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--landing-green)]">
            {monthLabel}
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {weekRange}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NavButton
            label="Previous week"
            onClick={() => onWeekChange(addDaysToDate(weekStart, -7))}
          >
            <ChevronLeft className="size-4" />
          </NavButton>
          <button
            type="button"
            onClick={() => onWeekChange(getWeekStartDate())}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Today
          </button>
          <NavButton
            label="Next week"
            onClick={() => onWeekChange(addDaysToDate(weekStart, 7))}
          >
            <ChevronRight className="size-4" />
          </NavButton>

          <label className="sr-only" htmlFor="week-picker">
            Jump to week
          </label>
          <input
            id="week-picker"
            type="date"
            value={weekInputValue}
            onChange={(e) => {
              if (e.target.value) {
                onWeekChange(getWeekStartDate(parseLocalDateKey(e.target.value)));
              }
            }}
            className="h-10 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white"
            title="Jump to week"
          />

          <label className="sr-only" htmlFor="month-picker">
            Jump to month
          </label>
          <input
            id="month-picker"
            type="month"
            value={monthValue}
            onChange={(e) => {
              if (e.target.value) {
                const [y, m] = e.target.value.split("-").map(Number);
                onWeekChange(getWeekStartDate(new Date(y!, m! - 1, 1)));
              }
            }}
            className="h-10 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white"
            title="Jump to month"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-white/60 sm:text-base">
            <span className="font-semibold text-white">{occupancyPercent}%</span> of
            this week&apos;s slots are booked.
          </p>
          {weekStart <= todayLocalDate() && todayLocalDate() <= weekEnd && (
            <span className="rounded-full bg-[var(--landing-green)]/20 px-3 py-1 text-xs font-bold text-[var(--landing-green)]">
              Includes today
            </span>
          )}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--landing-green)] to-[var(--landing-gold)] transition-all duration-500"
            style={{ width: `${Math.min(100, occupancyPercent)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function NavButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-10 items-center justify-center rounded-xl border border-white/15",
        "text-white transition-colors hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}
