"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AvailabilityLegend } from "@/components/availability/availability-legend";
import { AvailabilityFiltersBar } from "@/components/availability/availability-filters";
import { SlotDetailDialog } from "@/components/availability/slot-detail-dialog";
import { LandingButtonNative } from "@/components/landing/primitives/button";
import { cn } from "@/lib/utils";
import type { AvailabilityFilters, PublicSlotDetail } from "@/types/availability";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CalendarDays, Clock } from "lucide-react";

const CalendarViews = dynamic(
  () => import("./availability-calendar-views").then((m) => m.AvailabilityCalendarViews),
  {
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <div className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--landing-green)]" />
      </div>
    ),
    ssr: false,
  },
);

type ViewMode = "month" | "week" | "day";

type AvailabilityCalendarProps = {
  initialYear: number;
  initialMonth: number;
  initialMonthData: Record<string, PublicSlotDetail[]>;
};

export function AvailabilityCalendar({
  initialYear,
  initialMonth,
  initialMonthData,
}: AvailabilityCalendarProps) {
  const [view, setView] = useState<ViewMode>("month");
  const [filters, setFilters] = useState<AvailabilityFilters>({});
  const [selectedSlot, setSelectedSlot] = useState<PublicSlotDetail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSlotClick = (slot: PublicSlotDetail) => {
    if (slot.status === "available") return;
    setSelectedSlot(slot);
    setDialogOpen(true);
  };

  const views: { id: ViewMode; label: string; icon: typeof Calendar }[] = [
    { id: "month", label: "Month", icon: Calendar },
    { id: "week", label: "Week", icon: CalendarDays },
    { id: "day", label: "Day", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-full border border-white/15 bg-white/5 p-1">
          {views.map(({ id, label, icon: Icon }) => (
            <LandingButtonNative
              key={id}
              variant={view === id ? "gold" : "ghost"}
              size="default"
              onClick={() => setView(id)}
              className={cn(
                "min-h-10 px-4 text-sm",
                view !== id && "text-white/70",
              )}
            >
              <Icon className="size-4" />
              {label}
            </LandingButtonNative>
          ))}
        </div>
        <AvailabilityLegend />
      </div>

      <AvailabilityFiltersBar filters={filters} onChange={setFilters} />

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <CalendarViews
            view={view}
            initialYear={initialYear}
            initialMonth={initialMonth}
            initialMonthData={initialMonthData}
            filters={filters}
            onSlotClick={handleSlotClick}
          />
        </motion.div>
      </AnimatePresence>

      <SlotDetailDialog
        slot={selectedSlot}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
