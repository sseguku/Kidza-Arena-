"use client";

import { cn } from "@/lib/utils";
import { formatTimeLabel } from "@/lib/booking/constants";
import { SLOT_STATUS_COLORS, type OccupiedSlot } from "@/types/availability";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type AdminCalendarProps = {
  year: number;
  month: number;
  slotsByDate: Record<string, OccupiedSlot[]>;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function slotHref(slot: OccupiedSlot): string {
  if (slot.source === "booking") return "/admin/bookings";
  return "/admin/availability";
}

function slotLabel(slot: OccupiedSlot): string {
  const hour = parseInt(slot.startTime.split(":")[0] ?? "0", 10);
  const name = slot.teamName.split(" ")[0] ?? slot.teamName;
  return `${formatTimeLabel(hour)} ${name}`;
}

function slotTitle(slot: OccupiedSlot): string {
  const status = SLOT_STATUS_COLORS[slot.status]?.label ?? slot.status;
  return `${slot.teamName} — ${slot.startTime.slice(0, 5)}–${slot.endTime.slice(0, 5)} (${status})`;
}

function slotClassName(status: OccupiedSlot["status"]): string {
  const colors = SLOT_STATUS_COLORS[status];
  return cn(
    "block truncate rounded-md border px-1.5 py-0.5 text-[10px] font-medium hover:opacity-90 sm:text-xs",
    colors.bg,
    colors.border,
    colors.text,
  );
}

export function AdminCalendar({ year, month, slotsByDate }: AdminCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const navigate = (y: number, m: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(y));
    params.set("month", String(m));
    router.push(`/admin/calendar?${params.toString()}`);
  };

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("en-UG", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const nextMonth = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold">{monthLabel}</h2>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {(["booked", "pending", "recurring", "blocked"] as const).map((status) => (
            <span key={status} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "size-2.5 rounded-full border",
                  SLOT_STATUS_COLORS[status].bg,
                  SLOT_STATUS_COLORS[status].border,
                )}
              />
              {SLOT_STATUS_COLORS[status].label}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(prevMonth.y, prevMonth.m)}
            className="flex size-9 items-center justify-center rounded-lg border border-border hover:bg-muted"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate(nextMonth.y, nextMonth.m)}
            className="flex size-9 items-center justify-center rounded-lg border border-border hover:bg-muted"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-7 border-b border-border bg-muted/40">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground"
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
                  key={`empty-${i}`}
                  className="min-h-[100px] border-b border-r border-border bg-muted/10 last:border-r-0"
                />
              );
            }

            const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const daySlots = slotsByDate[dateKey] ?? [];
            const isToday = dateKey === new Date().toISOString().split("T")[0];

            return (
              <div
                key={dateKey}
                className={cn(
                  "min-h-[100px] border-b border-r border-border p-2 last:border-r-0 sm:min-h-[120px]",
                  isToday && "bg-primary/5",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-7 items-center justify-center rounded-full text-xs font-bold",
                    isToday && "bg-primary text-primary-foreground",
                  )}
                >
                  {day}
                </span>
                <div className="mt-1 space-y-1">
                  {daySlots.slice(0, 3).map((slot) => (
                    <Link
                      key={slot.id}
                      href={slotHref(slot)}
                      className={slotClassName(slot.status)}
                      title={slotTitle(slot)}
                    >
                      {slotLabel(slot)}
                    </Link>
                  ))}
                  {daySlots.length > 3 && (
                    <p className="text-[10px] text-muted-foreground">
                      +{daySlots.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
