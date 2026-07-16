"use client";

import { BookingPriceBadge } from "@/components/booking/booking-price-badge";
import { GlassCard } from "@/components/landing/primitives/glass-card";
import {
  DURATION_OPTIONS,
  formatTimeLabel,
  TIME_SLOTS,
} from "@/lib/booking/constants";
import { getUnavailableSlots, getBookableSlotStatusForTime } from "@/lib/booking/availability";
import {
  calculateBookingPrice,
  getSessionPeriod,
} from "@/lib/booking/pricing";
import { cn } from "@/lib/utils";
import {
  AvailabilityLegend,
  BOOKING_LEGEND_STATUSES,
  getSlotClassName,
} from "@/components/availability/availability-legend";
import type { OccupiedSlot } from "@/types/availability";
import type { BookingType } from "@/types/booking";
import { motion } from "framer-motion";
import { Calendar, Clock, Loader2, Moon, Sun } from "lucide-react";
import { useMemo } from "react";

type StepScheduleProps = {
  bookingType: BookingType;
  date: string;
  startTime: string;
  durationHours: number;
  playerCount: number;
  occupiedSlots: OccupiedSlot[];
  isLoadingAvailability: boolean;
  onDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onDurationChange: (hours: number) => void;
  errors?: Record<string, string>;
  suggestions?: { date: string; startTime: string; endTime: string; label: string }[];
};

function todayISO(): string {
  const d = new Date();
  return d.toISOString().split("T")[0]!;
}

export function StepSchedule({
  bookingType,
  date,
  startTime,
  durationHours,
  playerCount,
  occupiedSlots,
  isLoadingAvailability,
  onDateChange,
  onStartTimeChange,
  onDurationChange,
  errors = {},
  suggestions = [],
}: StepScheduleProps) {
  const durationOptions = DURATION_OPTIONS[bookingType];

  const bookableOccupied = useMemo(
    () => occupiedSlots.filter((slot) => slot.status !== "pending"),
    [occupiedSlots],
  );

  const unavailable = useMemo(() => {
    if (!date) return new Set<string>();
    return getUnavailableSlots(date, durationHours, bookableOccupied);
  }, [date, durationHours, bookableOccupied]);

  const sessionPeriod = startTime ? getSessionPeriod(startTime) : null;

  const price =
    bookingType === "individual"
      ? calculateBookingPrice({
          bookingType,
          durationHours,
          playerCount: 1,
        })
      : calculateBookingPrice({
          bookingType,
          durationHours,
          playerCount: Math.max(1, playerCount),
        });

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Pick your date &amp; time
        </h2>
        <p className="mt-2 text-white/60">
          Select when you&apos;d like to play. Green slots are available.
        </p>
      </header>

      <GlassCard className="space-y-6">
        <AvailabilityLegend
          statuses={BOOKING_LEGEND_STATUSES}
          className="justify-center sm:justify-start"
        />
        <div className="space-y-2">
          <label
            htmlFor="booking-date"
            className="flex items-center gap-2 text-sm font-semibold text-white/80"
          >
            <Calendar className="size-4 text-[var(--landing-green)]" />
            Date
          </label>
          <input
            id="booking-date"
            type="date"
            min={todayISO()}
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className={cn(
              "h-14 w-full rounded-xl border-2 bg-white/5 px-4 text-base text-white",
              "border-white/15 focus:border-[var(--landing-green)] focus:outline-none focus:ring-2 focus:ring-[var(--landing-green)]/30",
              errors.date && "border-red-400",
            )}
          />
          {errors.date && (
            <p className="text-sm text-red-400">{errors.date}</p>
          )}
        </div>

        {bookingType === "team" && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <Clock className="size-4 text-[var(--landing-green)]" />
              Duration
            </label>
            <div className="flex flex-wrap gap-2">
              {durationOptions.map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => onDurationChange(hours)}
                  className={cn(
                    "min-h-12 rounded-full px-6 text-base font-bold transition-all",
                    durationHours === hours
                      ? "bg-[var(--landing-green)] text-white shadow-glow-green"
                      : "border-2 border-white/20 bg-white/5 text-white/70 hover:border-white/40",
                  )}
                >
                  {hours} {hours === 1 ? "hour" : "hours"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <Clock className="size-4 text-[var(--landing-green)]" />
              Preferred start time
            </label>
            {isLoadingAvailability && (
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <Loader2 className="size-3 animate-spin" />
                Checking availability…
              </span>
            )}
          </div>

          {!date ? (
            <p className="rounded-xl bg-white/5 px-4 py-6 text-center text-sm text-white/50">
              Select a date to see available time slots
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {TIME_SLOTS.map((slot) => {
                const hour = parseInt(slot.split(":")[0] ?? "0", 10);
                const isUnavailable = unavailable.has(slot);
                const isSelected = startTime === slot;
                const isNight = hour >= 18;
                const status = date
                  ? getBookableSlotStatusForTime(
                      date,
                      slot,
                      durationHours,
                      bookableOccupied,
                    )
                  : "available";
                const displayStatus =
                  status === "pending" || status === "cancelled"
                    ? "available"
                    : status;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isUnavailable}
                    onClick={() => onStartTimeChange(slot)}
                    className={cn(
                      "relative flex min-h-14 flex-col items-center justify-center rounded-xl border-2 px-2 py-2 text-sm font-semibold transition-all",
                      isSelected &&
                        "border-[var(--landing-gold)] bg-[var(--landing-gold)]/15 text-[var(--landing-gold)] shadow-glow-gold",
                      !isSelected &&
                        !isUnavailable &&
                        displayStatus === "available" &&
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400",
                      !isSelected &&
                        isUnavailable &&
                        getSlotClassName(
                          displayStatus === "available" ? "blocked" : displayStatus,
                        ),
                      !isSelected &&
                        isUnavailable &&
                        "cursor-not-allowed opacity-80",
                    )}
                  >
                    {formatTimeLabel(hour)}
                    <span className="mt-0.5 text-[10px] font-normal uppercase tracking-wide opacity-60">
                      {isNight ? "Night" : "Day"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {errors.startTime && (
            <div className="space-y-2">
              <p className="text-sm text-red-400">{errors.startTime}</p>
              {suggestions.length > 0 && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <p className="text-sm font-semibold text-emerald-300">
                    Try these available slots:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {suggestions.map((s) => (
                      <li key={s.label}>
                        <button
                          type="button"
                          onClick={() => {
                            onDateChange(s.date);
                            onStartTimeChange(s.startTime);
                          }}
                          className="text-sm text-emerald-200 underline-offset-2 hover:underline"
                        >
                          {s.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {sessionPeriod && startTime && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            {sessionPeriod === "day" ? (
              <Sun className="size-5 text-[var(--landing-gold)]" />
            ) : (
              <Moon className="size-5 text-indigo-300" />
            )}
            <div>
              <p className="text-sm font-semibold capitalize text-white">
                {sessionPeriod} session
              </p>
              <p className="text-xs text-white/50">
                Starting at {formatTimeLabel(parseInt(startTime.split(":")[0] ?? "0", 10))}
              </p>
            </div>
          </motion.div>
        )}

        <BookingPriceBadge
          amount={price}
          label={
            bookingType === "individual"
              ? "Price per person"
              : "Price (hourly rate × duration)"
          }
        />
      </GlassCard>
    </div>
  );
}
