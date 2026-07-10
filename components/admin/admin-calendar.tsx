"use client";

import { cn } from "@/lib/utils";
import { formatTimeLabel } from "@/lib/booking/constants";
import { formatUGX } from "@/lib/booking/pricing";
import type { BookingRecord } from "@/types/booking";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type AdminCalendarProps = {
  year: number;
  month: number;
  bookings: BookingRecord[];
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function AdminCalendar({ year, month, bookings }: AdminCalendarProps) {
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

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, BookingRecord[]>();
    for (const b of bookings) {
      const list = map.get(b.booking_date) ?? [];
      list.push(b);
      map.set(b.booking_date, list);
    }
    return map;
  }, [bookings]);

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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{monthLabel}</h2>
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
            const dayBookings = bookingsByDate.get(dateKey) ?? [];
            const isToday =
              dateKey === new Date().toISOString().split("T")[0];

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
                  {dayBookings.slice(0, 3).map((b) => {
                    const hour = parseInt(b.start_time.split(":")[0] ?? "0", 10);
                    return (
                      <Link
                        key={b.id}
                        href="/admin/bookings"
                        className="block truncate rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20 sm:text-xs"
                        title={`${b.full_name} — ${formatUGX(b.price_ugx)}`}
                      >
                        {formatTimeLabel(hour)} {b.full_name.split(" ")[0]}
                      </Link>
                    );
                  })}
                  {dayBookings.length > 3 && (
                    <p className="text-[10px] text-muted-foreground">
                      +{dayBookings.length - 3} more
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
