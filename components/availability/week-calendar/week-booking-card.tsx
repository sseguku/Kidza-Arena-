"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Wrench, Repeat, Clock, CalendarClock } from "lucide-react";
import type { PublicSlotDetail } from "@/types/availability";
import { cn } from "@/lib/utils";
import {
  bookingTypeLabel,
  durationToGridHeight,
  timeToGridTop,
} from "./week-calendar-utils";
import { getWeekSlotStyles, weekSlotClassName } from "./week-calendar-colors";

type WeekBookingCardProps = {
  slot: PublicSlotDetail;
  onClick: () => void;
  onHover: (slot: PublicSlotDetail | null) => void;
  compact?: boolean;
};

function TeamIcon({ slot }: { slot: PublicSlotDetail }) {
  if (slot.source === "block") return <Wrench className="size-3.5 shrink-0 opacity-80" />;
  if (slot.source === "recurring" || slot.status === "recurring") {
    return <Repeat className="size-3.5 shrink-0 opacity-80" />;
  }
  return <Users className="size-3.5 shrink-0 opacity-80" />;
}

export function WeekBookingCard({
  slot,
  onClick,
  onHover,
  compact = false,
}: WeekBookingCardProps) {
  const styles = getWeekSlotStyles(slot);
  const typeLabel = bookingTypeLabel(slot);

  if (compact) {
    return (
      <motion.button
        type="button"
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        onMouseEnter={() => onHover(slot)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(slot)}
        onBlur={() => onHover(null)}
        className={cn(
          "group relative flex w-full flex-col gap-1 overflow-hidden rounded-2xl p-3 text-left shadow-lg shadow-black/20 transition-shadow hover:shadow-xl hover:shadow-black/30",
          weekSlotClassName(slot),
        )}
      >
        <span className={cn("absolute inset-y-2 left-0 w-1 rounded-full", styles.accent)} />
        <div className="flex items-start gap-2 pl-2">
          <TeamIcon slot={slot} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold leading-tight">{slot.teamName}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs opacity-90">
              <Clock className="size-3" />
              {slot.startLabel} – {slot.endLabel}
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wide opacity-70">
              {typeLabel}
            </p>
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015, zIndex: 20 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      onMouseEnter={() => onHover(slot)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(slot)}
      onBlur={() => onHover(null)}
      style={{
        top: timeToGridTop(slot.startTime),
        height: durationToGridHeight(slot.startTime, slot.endTime),
      }}
      className={cn(
        "absolute inset-x-1.5 z-10 flex flex-col overflow-hidden rounded-[18px] p-3 text-left shadow-lg shadow-black/25 transition-shadow hover:shadow-xl hover:shadow-black/40",
        weekSlotClassName(slot),
      )}
    >
      <span className={cn("absolute inset-y-2 left-0 w-1.5 rounded-full", styles.accent)} />
      <div className="flex min-h-0 flex-1 flex-col pl-3">
        <div className="flex items-start gap-2">
          <TeamIcon slot={slot} />
          <p className="truncate text-sm font-bold leading-snug sm:text-base">
            {slot.teamName}
          </p>
        </div>
        <p className="mt-1 text-xs font-semibold opacity-95 sm:text-sm">
          {slot.startLabel} – {slot.endLabel}
        </p>
        <p className="mt-auto pt-1 text-[10px] font-medium uppercase tracking-wider opacity-75 sm:text-xs">
          {typeLabel}
        </p>
        <p className="text-[10px] opacity-60">
          {Math.round(slot.durationMinutes / 60) || 1}h duration
        </p>
      </div>
    </motion.button>
  );
}

export function WeekAvailableCell({
  date,
  hour,
}: {
  date: string;
  hour: number;
}) {
  const time = `${hour.toString().padStart(2, "0")}:00`;

  return (
    <Link
      href={`/book?date=${date}&time=${time}`}
      className="group flex h-full min-h-[72px] w-full items-center justify-center rounded-2xl border border-dashed border-emerald-500/20 bg-emerald-500/[0.03] px-2 transition-all hover:border-emerald-400/50 hover:bg-emerald-500/10"
    >
      <span className="text-center text-[11px] font-medium text-emerald-400/50 transition-colors group-hover:text-emerald-300">
        <span className="hidden group-hover:inline">Book this slot</span>
        <span className="group-hover:hidden">+ Available</span>
      </span>
    </Link>
  );
}

export function WeekAvailableBlock({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-[72px] items-center justify-center rounded-2xl border border-dashed border-emerald-500/20 bg-emerald-500/[0.03] px-3">
      <span className="text-xs font-medium text-emerald-400/60">{label}</span>
    </div>
  );
}

export function WeekDayEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16">
      <CalendarClock className="size-8 text-white/20" />
      <p className="text-sm text-white/40">No bookings this day</p>
      <Link
        href="/book"
        className="mt-2 text-sm font-semibold text-[var(--landing-green)] hover:underline"
      >
        Book a slot
      </Link>
    </div>
  );
}
