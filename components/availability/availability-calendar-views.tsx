"use client";

import { getSlotClassName } from "@/components/availability/availability-legend";
import { PremiumWeekCalendar } from "@/components/availability/week-calendar/premium-week-calendar";
import {
  getDayAvailabilityAction,
  getMonthAvailabilityAction,
  getWeekAvailabilityAction,
} from "@/app/(site)/availability/actions";
import {
  getWeekStartDate,
  todayLocalDate,
} from "@/lib/booking/dates";
import { cn } from "@/lib/utils";
import type { AvailabilityFilters, PublicSlotDetail } from "@/types/availability";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type ViewMode = "month" | "week" | "day";

type Props = {
  view: ViewMode;
  initialYear: number;
  initialMonth: number;
  initialMonthData: Record<string, PublicSlotDetail[]>;
  filters: AvailabilityFilters;
  onSlotClick: (slot: PublicSlotDetail) => void;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function applyClientFilters(
  slots: PublicSlotDetail[],
  filters: AvailabilityFilters,
  options?: { forDayView?: boolean },
): PublicSlotDetail[] {
  let result = [...slots];
  if (!options?.forDayView && filters.dayOfWeek !== undefined) {
    result = result.filter((s) => {
      const [y, mo, d] = s.date.split("-").map(Number);
      return new Date(y!, mo! - 1, d!).getDay() === filters.dayOfWeek;
    });
  }
  if (filters.period && filters.period !== "all") {
    result = result.filter((s) => {
      const hour = parseInt(s.startTime.split(":")[0] ?? "0", 10);
      if (filters.period === "morning") return hour >= 6 && hour < 12;
      if (filters.period === "afternoon") return hour >= 12 && hour < 17;
      return hour >= 17;
    });
  }
  if (filters.showBookedOnly) {
    result = result.filter((s) => s.status !== "available");
  }
  return result;
}

function filtersForDayView(filters: AvailabilityFilters): AvailabilityFilters {
  const { dayOfWeek: _dayOfWeek, date: _date, ...rest } = filters;
  return rest;
}

export function AvailabilityCalendarViews({
  view,
  initialYear,
  initialMonth,
  initialMonthData,
  filters,
  onSlotClick,
}: Props) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [monthData, setMonthData] = useState(initialMonthData);
  const [extraDaySlots, setExtraDaySlots] = useState<Record<string, PublicSlotDetail[]>>({});
  const [weekSlots, setWeekSlots] = useState<PublicSlotDetail[]>([]);
  const [weekLoading, setWeekLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(todayLocalDate());
  const [weekStart, setWeekStart] = useState(getWeekStartDate());
  const [loading, setLoading] = useState(false);
  const [dayLoading, setDayLoading] = useState(false);

  const displayDate = filters.date ?? selectedDay;

  const daySlotsForView = useMemo(() => {
    const fromMonth = monthData[displayDate];
    const fromExtra = extraDaySlots[displayDate];
    const source = fromMonth?.length ? fromMonth : (fromExtra ?? []);
    return applyClientFilters(source, filters, { forDayView: true });
  }, [monthData, extraDaySlots, displayDate, filters]);

  const loadMonth = useCallback(async (y: number, m: number) => {
    setLoading(true);
    try {
      const data = await getMonthAvailabilityAction(y, m);
      const hasSlots = Object.values(data.slotsByDate).some((slots) => slots.length > 0);
      if (hasSlots || Object.keys(data.slotsByDate).length > 0) {
        setMonthData(data.slotsByDate);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === "month") void loadMonth(year, month);
  }, [year, month, view, loadMonth]);

  useEffect(() => {
    if (view !== "day") return;
    const [y, m] = displayDate.split("-").map(Number);
    if (!y || !m) return;
    if (y !== year || m !== month) {
      setYear(y);
      setMonth(m);
      void loadMonth(y, m);
    }
  }, [view, displayDate, year, month, loadMonth]);

  useEffect(() => {
    if (view !== "day") return;
    if (monthData[displayDate]?.length) return;

    let cancelled = false;
    setDayLoading(true);
    void getDayAvailabilityAction(displayDate, filtersForDayView(filters))
      .then((r) => {
        if (cancelled) return;
        setExtraDaySlots((prev) => ({ ...prev, [displayDate]: r.slots }));
      })
      .finally(() => {
        if (!cancelled) setDayLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [view, displayDate, filters, monthData]);

  useEffect(() => {
    if (view !== "week") return;
    const start = filters.date ? getWeekStartDate(parseLocalDateFromKey(filters.date)) : weekStart;
    if (filters.date && start !== weekStart) {
      setWeekStart(start);
    }
    let cancelled = false;
    setWeekLoading(true);
    void getWeekAvailabilityAction(start)
      .then((r) => {
        if (!cancelled) {
          setWeekSlots(applyClientFilters(r.slots, filters));
        }
      })
      .finally(() => {
        if (!cancelled) setWeekLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [view, filters, weekStart]);

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("en-UG", {
    month: "long",
    year: "numeric",
  });

  const days = useMemo(() => {
    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);
    const startPad = (first.getDay() + 6) % 7;
    const totalDays = last.getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [year, month]);

  const navigateMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y--;
    } else if (m > 12) {
      m = 1;
      y++;
    }
    setYear(y);
    setMonth(m);
  };

  if (view === "month") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white sm:text-2xl">{monthLabel}</h2>
          <div className="flex gap-2">
            <NavBtn onClick={() => navigateMonth(-1)} label="Previous month" />
            <NavBtn onClick={() => navigateMonth(1)} label="Next month" />
          </div>
        </div>
        {loading ? (
          <LoadingState />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-white/50"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day, i) => {
                if (day === null) {
                  return (
                    <div
                      key={`e-${i}`}
                      className="min-h-[100px] border-b border-r border-white/5 bg-white/[0.02] last:border-r-0 sm:min-h-[120px]"
                    />
                  );
                }
                const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const slots = applyClientFilters(
                  monthData[dateKey] ?? [],
                  filters,
                );
                const isToday = dateKey === todayLocalDate();

                return (
                  <div
                    key={dateKey}
                    className={cn(
                      "min-h-[100px] border-b border-r border-white/10 p-2 text-left last:border-r-0 sm:min-h-[120px]",
                      isToday && "bg-[var(--landing-green)]/10",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDay(dateKey);
                        setWeekStart(getWeekStartDate(parseLocalDateFromKey(dateKey)));
                      }}
                      className={cn(
                        "inline-flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors hover:bg-white/10",
                        isToday && "bg-[var(--landing-gold)] text-[#0B0F14]",
                        !isToday && "text-white/80",
                      )}
                      aria-label={`Select ${dateKey}`}
                    >
                      {day}
                    </button>
                    <div className="mt-1 space-y-1">
                      {slots.slice(0, 3).map((slot) => (
                        <SlotPill
                          key={slot.id}
                          slot={slot}
                          onClick={() => onSlotClick(slot)}
                        />
                      ))}
                      {slots.length > 3 && (
                        <p className="text-[10px] text-white/40">
                          +{slots.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === "week") {
    const start = filters.date ? getWeekStartDate(parseLocalDateFromKey(filters.date)) : weekStart;

    return (
      <PremiumWeekCalendar
        weekStart={start}
        onWeekChange={setWeekStart}
        slots={weekSlots}
        loading={weekLoading}
        onSlotClick={onSlotClick}
      />
    );
  }

  const filteredDay = daySlotsForView;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={displayDate}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="h-11 rounded-xl border border-white/15 bg-white/5 px-4 text-white"
        />
        <h2 className="text-lg font-bold text-white">
          {parseLocalDateFromKey(displayDate).toLocaleDateString("en-UG", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h2>
      </div>
      <div className="space-y-2">
        {dayLoading && filteredDay.length === 0 ? (
          <LoadingState />
        ) : filteredDay.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 py-12 text-center text-white/50">
            No bookings scheduled for this day.
          </p>
        ) : (
          filteredDay.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSlotClick(slot)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition-transform hover:scale-[1.01]",
                getSlotClassName(slot.status),
              )}
            >
              <div>
                <p className="font-bold">{slot.teamName}</p>
                <p className="text-sm opacity-80 capitalize">{slot.bookingType}</p>
              </div>
              <p className="text-sm font-semibold">
                {slot.startLabel} – {slot.endLabel}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function SlotPill({
  slot,
  onClick,
}: {
  slot: PublicSlotDetail;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "block w-full truncate rounded-md px-1.5 py-0.5 text-left text-[10px] font-semibold sm:text-xs",
        getSlotClassName(slot.status),
      )}
    >
      {slot.teamName}
      <span className="hidden sm:inline">
        {" "}
        · {slot.startLabel}
      </span>
    </button>
  );
}

function parseLocalDateFromKey(date: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(y!, mo! - 1, d!);
}

function NavBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-lg border border-white/15 text-white hover:bg-white/10"
    >
      {label.includes("Previous") ? (
        <ChevronLeft className="size-4" />
      ) : (
        <ChevronRight className="size-4" />
      )}
    </button>
  );
}

function LoadingState() {
  return (
    <div className="flex h-96 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
      <div className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--landing-green)]" />
    </div>
  );
}

