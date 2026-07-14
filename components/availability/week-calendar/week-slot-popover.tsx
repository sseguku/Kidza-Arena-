"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PublicSlotDetail } from "@/types/availability";
import { cn } from "@/lib/utils";
import {
  bookingTypeLabel,
  statusDisplayLabel,
} from "./week-calendar-utils";
import { getWeekSlotStyles } from "./week-calendar-colors";

type WeekSlotPopoverProps = {
  slot: PublicSlotDetail | null;
};

export function WeekSlotPopover({ slot }: WeekSlotPopoverProps) {
  const styles = slot ? getWeekSlotStyles(slot) : null;

  return (
    <AnimatePresence>
      {slot && styles && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 w-[min(100%,22rem)] -translate-x-1/2 rounded-2xl border border-white/15 bg-[#0B0F14]/95 p-4 shadow-2xl backdrop-blur-xl sm:bottom-auto sm:top-24 sm:left-auto sm:right-8 sm:translate-x-0 lg:right-12"
          role="tooltip"
        >
          <div className="flex items-start gap-3">
            <span className={cn("mt-1 size-3 shrink-0 rounded-full", styles.accent)} />
            <div className="min-w-0 space-y-2">
              <p className="text-base font-bold text-white">{slot.teamName}</p>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                <dt className="text-white/45">Type</dt>
                <dd className="font-medium text-white/90">{bookingTypeLabel(slot)}</dd>
                <dt className="text-white/45">Day</dt>
                <dd className="font-medium text-white/90">{slot.dayLabel}</dd>
                <dt className="text-white/45">Start</dt>
                <dd className="font-medium text-white/90">{slot.startLabel}</dd>
                <dt className="text-white/45">End</dt>
                <dd className="font-medium text-white/90">{slot.endLabel}</dd>
                <dt className="text-white/45">Duration</dt>
                <dd className="font-medium text-white/90">
                  {slot.durationMinutes >= 60
                    ? `${Math.round(slot.durationMinutes / 60)}h`
                    : `${slot.durationMinutes}m`}
                </dd>
                <dt className="text-white/45">Status</dt>
                <dd className="font-medium text-white/90">
                  {statusDisplayLabel(slot.status)}
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
