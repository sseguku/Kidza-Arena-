"use client";

import { cn } from "@/lib/utils";
import type { AvailabilityFilters } from "@/types/availability";
import { DAY_NAMES } from "@/types/availability";

type AvailabilityFiltersBarProps = {
  filters: AvailabilityFilters;
  onChange: (filters: AvailabilityFilters) => void;
  className?: string;
};

const periods = [
  { value: "all", label: "All day" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
] as const;

export function AvailabilityFiltersBar({
  filters,
  onChange,
  className,
}: AvailabilityFiltersBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:flex-wrap sm:items-center",
        className,
      )}
    >
      <div className="space-y-1.5">
        <label htmlFor="filter-date" className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Date
        </label>
        <input
          id="filter-date"
          type="date"
          value={filters.date ?? ""}
          onChange={(e) => onChange({ ...filters, date: e.target.value || undefined })}
          className="h-10 rounded-lg border border-white/15 bg-[#0B0F14] px-3 text-sm text-white"
        />
      </div>

      <div className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Day
        </span>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={filters.dayOfWeek === undefined}
            onClick={() => onChange({ ...filters, dayOfWeek: undefined })}
          >
            Any
          </FilterChip>
          {DAY_NAMES.map((day, i) => (
            <FilterChip
              key={day}
              active={filters.dayOfWeek === i}
              onClick={() => onChange({ ...filters, dayOfWeek: i })}
            >
              {day.slice(0, 3)}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Period
        </span>
        <div className="flex flex-wrap gap-1.5">
          {periods.map((p) => (
            <FilterChip
              key={p.value}
              active={(filters.period ?? "all") === p.value}
              onClick={() =>
                onChange({
                  ...filters,
                  period: p.value === "all" ? undefined : p.value,
                })
              }
            >
              {p.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="flex gap-2 sm:ml-auto">
        <FilterChip
          active={!!filters.showBookedOnly}
          onClick={() =>
            onChange({
              ...filters,
              showBookedOnly: !filters.showBookedOnly,
              showAvailableOnly: false,
            })
          }
        >
          Booked only
        </FilterChip>
      </div>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-9 rounded-full px-3 text-xs font-bold transition-colors sm:text-sm",
        active
          ? "bg-[var(--landing-gold)] text-[#0B0F14]"
          : "border border-white/20 bg-white/5 text-white/70 hover:border-white/40",
      )}
    >
      {children}
    </button>
  );
}
