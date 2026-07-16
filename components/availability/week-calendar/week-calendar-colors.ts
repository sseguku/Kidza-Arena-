import type { PublicSlotDetail, SlotStatus } from "@/types/availability";
import { cn } from "@/lib/utils";

/** Premium week calendar colour system */
export const WEEK_SLOT_STYLES: Record<
  SlotStatus,
  { accent: string; bg: string; border: string; text: string; label: string }
> = {
  recurring: {
    accent: "bg-[#117a3d]",
    bg: "bg-[#117a3d]/20 backdrop-blur-md",
    border: "border-[#117a3d]/50",
    text: "text-emerald-100",
    label: "Recurring Booking",
  },
  booked: {
    accent: "bg-blue-500",
    bg: "bg-blue-500/20 backdrop-blur-md",
    border: "border-blue-400/50",
    text: "text-blue-100",
    label: "Confirmed Booking",
  },
  pending: {
    accent: "bg-amber-500",
    bg: "bg-amber-500/20 backdrop-blur-md",
    border: "border-amber-400/50",
    text: "text-amber-100",
    label: "Pending",
  },
  blocked: {
    accent: "bg-zinc-600",
    bg: "bg-zinc-700/40 backdrop-blur-md",
    border: "border-zinc-500/50",
    text: "text-zinc-200",
    label: "Maintenance / Blocked",
  },
  cancelled: {
    accent: "bg-zinc-400",
    bg: "bg-zinc-500/15 backdrop-blur-md",
    border: "border-zinc-400/40",
    text: "text-zinc-300",
    label: "Cancelled",
  },
  available: {
    accent: "bg-emerald-500/50",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/30 border-dashed",
    text: "text-emerald-300/80",
    label: "Available",
  },
};

export function getWeekSlotStyles(slot: PublicSlotDetail) {
  if (slot.source === "block") return WEEK_SLOT_STYLES.blocked;
  if (slot.status === "recurring" || slot.source === "recurring") {
    return WEEK_SLOT_STYLES.recurring;
  }
  return WEEK_SLOT_STYLES[slot.status] ?? WEEK_SLOT_STYLES.booked;
}

export function weekSlotClassName(slot: PublicSlotDetail): string {
  const s = getWeekSlotStyles(slot);
  return cn("border", s.bg, s.border, s.text);
}

export const WEEK_LEGEND_ITEMS: SlotStatus[] = [
  "recurring",
  "booked",
  "cancelled",
  "blocked",
  "available",
];
