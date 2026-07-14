"use client";

import { WEEK_SLOT_STYLES, WEEK_LEGEND_ITEMS } from "./week-calendar-colors";
import { cn } from "@/lib/utils";

export function WeekCalendarLegend() {
  return (
    <div
      className="flex flex-wrap gap-x-5 gap-y-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
      role="list"
      aria-label="Booking colour legend"
    >
      {WEEK_LEGEND_ITEMS.map((status) => {
        const config = WEEK_SLOT_STYLES[status];
        return (
          <div key={status} className="flex items-center gap-2" role="listitem">
            <span
              className={cn("size-3 rounded-full border", config.accent, config.border)}
              aria-hidden
            />
            <span className="text-xs font-medium text-white/70 sm:text-sm">
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
