"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PublicSlotDetail } from "@/types/availability";
import { DAY_NAMES } from "@/types/availability";
import { cn } from "@/lib/utils";
import {
  formatHourLabel,
  getWeekHours,
  isHourAvailable,
} from "./week-calendar-utils";
import {
  WeekAvailableCell,
  WeekBookingCard,
  WeekDayEmptyState,
} from "./week-booking-card";

type WeekCalendarMobileProps = {
  weekDates: string[];
  weekStart: string;
  slots: PublicSlotDetail[];
  today: string;
  onSlotClick: (slot: PublicSlotDetail) => void;
  onHover: (slot: PublicSlotDetail | null) => void;
};

function parseLocalDateKey(date: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(y!, mo! - 1, d!);
}

export function WeekCalendarMobile({
  weekDates,
  weekStart,
  slots,
  today,
  onSlotClick,
  onHover,
}: WeekCalendarMobileProps) {
  const defaultIndex = Math.max(
    0,
    weekDates.findIndex((d) => d === today),
  );
  const [dayIndex, setDayIndex] = useState(defaultIndex);
  const hours = getWeekHours();

  useEffect(() => {
    const idx = Math.max(0, weekDates.findIndex((d) => d === today));
    setDayIndex(idx >= 0 ? idx : 0);
  }, [weekStart, weekDates, today]);

  const activeDate = weekDates[dayIndex] ?? weekDates[0]!;
  const activeDay = parseLocalDateKey(activeDate);
  const dow = activeDay.getDay();
  const isToday = activeDate === today;

  const daySlots = slots.filter(
    (s) => s.date === activeDate && s.status !== "available",
  );

  const goTo = useCallback(
    (index: number) => {
      setDayIndex(Math.max(0, Math.min(weekDates.length - 1, index)));
    },
    [weekDates.length],
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 60;
    if (info.offset.x < -threshold) goTo(dayIndex + 1);
    else if (info.offset.x > threshold) goTo(dayIndex - 1);
  };

  return (
    <div className="mt-4 space-y-4">
      <div
        className={cn(
          "sticky top-0 z-30 rounded-2xl border border-white/10 bg-[#0B0F14]/95 p-3 backdrop-blur-xl",
          isToday && "border-[var(--landing-green)]/30",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Previous day"
            disabled={dayIndex === 0}
            onClick={() => goTo(dayIndex - 1)}
            className="flex size-11 items-center justify-center rounded-xl border border-white/15 text-white disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p
              className={cn(
                "text-xs font-bold uppercase tracking-wider",
                isToday ? "text-[var(--landing-green)]" : "text-white/50",
              )}
            >
              {DAY_NAMES[dow]}
            </p>
            <p className="text-lg font-bold text-white">
              {activeDay.toLocaleDateString("en-UG", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <button
            type="button"
            aria-label="Next day"
            disabled={dayIndex === weekDates.length - 1}
            onClick={() => goTo(dayIndex + 1)}
            className="flex size-11 items-center justify-center rounded-xl border border-white/15 text-white disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
          {weekDates.map((date, i) => {
            const d = parseLocalDateKey(date);
            const selected = i === dayIndex;
            const dayIsToday = date === today;
            return (
              <button
                key={date}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  "flex min-w-[3rem] flex-col items-center rounded-xl px-2 py-2 transition-colors",
                  selected && "bg-[var(--landing-green)]/20",
                  !selected && "bg-white/5",
                  dayIsToday && !selected && "ring-1 ring-[var(--landing-green)]/40",
                )}
              >
                <span className="text-[10px] text-white/50">
                  {DAY_NAMES[d.getDay()]?.slice(0, 1)}
                </span>
                <span
                  className={cn(
                    "text-sm font-bold",
                    dayIsToday ? "text-[var(--landing-green)]" : "text-white",
                  )}
                >
                  {d.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${weekStart}-${activeDate}`}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="touch-pan-y space-y-3"
        >
          {daySlots.length === 0 && hours.every((h) => !isHourAvailable(activeDate, h, slots)) ? (
            <WeekDayEmptyState />
          ) : (
            <>
              {daySlots.map((slot) => (
                <WeekBookingCard
                  key={slot.id}
                  slot={slot}
                  compact
                  onClick={() => onSlotClick(slot)}
                  onHover={onHover}
                />
              ))}

              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Open slots
                </p>
                {hours
                  .filter((hour) => isHourAvailable(activeDate, hour, slots))
                  .map((hour) => (
                    <div key={hour} className="min-h-[72px]">
                      <p className="mb-1 text-xs text-white/40">{formatHourLabel(hour)}</p>
                      <WeekAvailableCell date={activeDate} hour={hour} />
                    </div>
                  ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
