"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSlotClassName } from "@/components/availability/availability-legend";
import type { PublicSlotDetail } from "@/types/availability";
import { Clock, Users } from "lucide-react";

type SlotDetailDialogProps = {
  slot: PublicSlotDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SlotDetailDialog({
  slot,
  open,
  onOpenChange,
}: SlotDetailDialogProps) {
  if (!slot) return null;

  const statusLabel =
    slot.status === "recurring" ? "Booked" : slot.status.charAt(0).toUpperCase() + slot.status.slice(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#111820] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{slot.teamName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-white/60">{slot.dayLabel}</p>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="size-5 text-[var(--landing-green)]" />
            {slot.startLabel} – {slot.endLabel}
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Users className="size-4" />
            <span className="capitalize">{slot.bookingType} booking</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getSlotClassName(slot.status)}`}
            >
              {statusLabel}
            </span>
            <span className="text-sm text-white/50">
              {Math.round(slot.durationMinutes / 60 * 10) / 10}h duration
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
