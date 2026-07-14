"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getWeekDateRange, todayLocalDate } from "@/lib/booking/dates";
import { DAY_NAMES } from "@/types/availability";
import type { PublicSlotDetail } from "@/types/availability";
import { cn } from "@/lib/utils";
import {
  computeWeekStats,
  formatHourLabel,
  getWeekHours,
  isHourAvailable,
  WEEK_GRID_HEIGHT_PX,
  WEEK_ROW_HEIGHT_PX,
} from "./week-calendar-utils";
import { WeekCalendarHeader } from "./week-calendar-header";
import { WeekCalendarLegend } from "./week-calendar-legend";
import { WeekCalendarSidebar } from "./week-calendar-sidebar";
import {
  WeekAvailableCell,
  WeekBookingCard,
} from "./week-booking-card";
import { WeekSlotPopover } from "./week-slot-popover";
import { WeekCalendarMobile } from "./week-calendar-mobile";

type PremiumWeekCalendarProps = {
  weekStart: string;
  onWeekChange: (start: string) => void;
  slots: PublicSlotDetail[];
  loading?: boolean;
  onSlotClick: (slot: PublicSlotDetail) => void;
};

function parseLocalDateKey(date: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(y!, mo! - 1, d!);
}

export function PremiumWeekCalendar({
  weekStart,
  onWeekChange,
  slots,
  loading = false,
  onSlotClick,
}: PremiumWeekCalendarProps) {
  const [hoveredSlot, setHoveredSlot] = useState<PublicSlotDetail | null>(null);
  const today = todayLocalDate();
  const weekDates = getWeekDateRange(weekStart);
  const hours = getWeekHours();

  const stats = useMemo(
    () => computeWeekStats(weekStart, slots, today),
    [weekStart, slots, today],
  );

  const slotsByDate = useMemo(() => {
    const map = new Map<string, PublicSlotDetail[]>();
    for (const date of weekDates) {
      map.set(
        date,
        slots.filter((s) => s.date === date && s.status !== "available"),
      );
    }
    return map;
  }, [slots, weekDates]);

  return (
    <div className="space-y-5">
      <WeekCalendarLegend />

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <WeekCalendarSidebar stats={stats} className="order-2 xl:order-1" />

        <div className="order-1 min-w-0 flex-1 xl:order-2">
          <WeekCalendarHeader
            weekStart={weekStart}
            onWeekChange={onWeekChange}
            occupancyPercent={stats.occupancyPercent}
          />

          {loading ? (
            <WeekCalendarSkeleton />
          ) : (
            <>
              <div className="hidden lg:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={weekStart}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#0B0F14]/60"
                  >
                    <div className="min-w-[960px]">
                      <div className="flex border-b border-white/10 bg-[#0B0F14]/95">
                        <div className="w-16 shrink-0 border-r border-white/10 sm:w-20" />
                        <WeekGridHeader weekDates={weekDates} today={today} />
                      </div>
                      <div className="flex">
                        <TimeGutter hours={hours} />
                        <div className="grid flex-1 grid-cols-7">
                          {weekDates.map((date) => (
                            <DayColumn
                              key={date}
                              date={date}
                              isToday={date === today}
                              daySlots={slotsByDate.get(date) ?? []}
                              hours={hours}
                              allSlots={slots}
                              onSlotClick={onSlotClick}
                              onHover={setHoveredSlot}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="lg:hidden">
                <WeekCalendarMobile
                  weekDates={weekDates}
                  weekStart={weekStart}
                  slots={slots}
                  today={today}
                  onSlotClick={onSlotClick}
                  onHover={setHoveredSlot}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <WeekSlotPopover slot={hoveredSlot} />
    </div>
  );
}

function WeekGridHeader({ weekDates, today }: { weekDates: string[]; today: string }) {
  return (
    <div className="sticky top-[140px] z-30 grid flex-1 grid-cols-7 backdrop-blur-md">
      {weekDates.map((date) => {
        const d = parseLocalDateKey(date);
        const dow = d.getDay();
        const isToday = date === today;
        return (
          <div
            key={date}
            className={cn(
              "border-r border-white/5 px-2 py-4 text-center last:border-r-0",
              isToday && "bg-[var(--landing-green)]/10",
            )}
          >
            <p
              className={cn(
                "text-xs font-bold uppercase tracking-wider",
                isToday ? "text-[var(--landing-green)]" : "text-white/45",
              )}
            >
              {DAY_NAMES[dow]?.slice(0, 3)}
            </p>
            <p
              className={cn(
                "mt-1 text-xl font-bold sm:text-2xl",
                isToday ? "text-[var(--landing-green)]" : "text-white",
              )}
            >
              {d.getDate()}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function TimeGutter({ hours }: { hours: number[] }) {
  return (
    <div
      className="sticky left-0 z-20 w-16 shrink-0 border-r border-white/10 bg-[#0B0F14]/95 backdrop-blur-md sm:w-20"
      style={{ height: WEEK_GRID_HEIGHT_PX }}
    >
      {hours.map((hour) => (
        <div
          key={hour}
          className="flex items-start justify-end border-b border-white/5 pr-2 pt-1"
          style={{ height: WEEK_ROW_HEIGHT_PX }}
        >
          <span className="text-[10px] font-medium text-white/40 sm:text-xs">
            {formatHourLabel(hour)}
          </span>
        </div>
      ))}
    </div>
  );
}

function DayColumn({
  date,
  isToday,
  daySlots,
  hours,
  allSlots,
  onSlotClick,
  onHover,
}: {
  date: string;
  isToday: boolean;
  daySlots: PublicSlotDetail[];
  hours: number[];
  allSlots: PublicSlotDetail[];
  onSlotClick: (slot: PublicSlotDetail) => void;
  onHover: (slot: PublicSlotDetail | null) => void;
}) {
  return (
    <div
      className={cn(
        "relative border-r border-white/5 last:border-r-0",
        isToday && "bg-[var(--landing-green)]/[0.04]",
      )}
      style={{ height: WEEK_GRID_HEIGHT_PX }}
    >
      {hours.map((hour) => (
        <div
          key={hour}
          className="absolute inset-x-0 border-b border-white/[0.06]"
          style={{ top: (hour - hours[0]!) * WEEK_ROW_HEIGHT_PX, height: WEEK_ROW_HEIGHT_PX }}
        />
      ))}

      {hours.map((hour) => {
        if (!isHourAvailable(date, hour, allSlots)) return null;
        return (
          <div
            key={`avail-${hour}`}
            className="absolute inset-x-1 z-0 p-0.5"
            style={{
              top: (hour - hours[0]!) * WEEK_ROW_HEIGHT_PX,
              height: WEEK_ROW_HEIGHT_PX,
            }}
          >
            <WeekAvailableCell date={date} hour={hour} />
          </div>
        );
      })}

      {daySlots.map((slot) => (
        <WeekBookingCard
          key={slot.id}
          slot={slot}
          onClick={() => onSlotClick(slot)}
          onHover={onHover}
        />
      ))}
    </div>
  );
}

function WeekCalendarSkeleton() {
  return (
    <div className="mt-4 flex h-[720px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--landing-green)]" />
    </div>
  );
}
