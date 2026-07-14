"use client";

import type { PublicSlotDetail } from "@/types/availability";
import { cn } from "@/lib/utils";
import { CalendarDays, Clock, TrendingUp, Zap } from "lucide-react";
import type { WeekStats } from "./week-calendar-utils";
import { getWeekSlotStyles } from "./week-calendar-colors";

function parseLocalDateKey(date: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(y!, mo! - 1, d!);
}

type WeekCalendarSidebarProps = {
  stats: WeekStats;
  className?: string;
};

function SidebarCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Clock;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2 text-[var(--landing-green)]">
        <Icon className="size-4" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/70">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function TodaySlotRow({ slot }: { slot: PublicSlotDetail }) {
  const styles = getWeekSlotStyles(slot);
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2">
      <span className={cn("size-2 shrink-0 rounded-full", styles.accent)} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{slot.teamName}</p>
        <p className="text-xs text-white/50">
          {slot.startLabel} – {slot.endLabel}
        </p>
      </div>
    </div>
  );
}

export function WeekCalendarSidebar({ stats, className }: WeekCalendarSidebarProps) {
  const peakLabel = parseLocalDateKey(stats.peakDay).toLocaleDateString("en-UG", {
    weekday: "long",
  });

  return (
    <aside
      className={cn(
        "flex flex-col gap-4 lg:w-72 lg:shrink-0 xl:w-80",
        className,
      )}
    >
      <SidebarCard title="Today's schedule" icon={Clock}>
        {stats.todaySlots.length === 0 ? (
          <p className="text-sm text-white/45">No bookings scheduled today.</p>
        ) : (
          <div className="space-y-2">
            {stats.todaySlots.slice(0, 4).map((slot) => (
              <TodaySlotRow key={slot.id} slot={slot} />
            ))}
          </div>
        )}
      </SidebarCard>

      <SidebarCard title="Next available" icon={Zap}>
        {stats.nextAvailable ? (
          <p className="text-lg font-bold text-[var(--landing-gold)]">
            {stats.nextAvailable.label}
          </p>
        ) : (
          <p className="text-sm text-white/45">No open slots this week.</p>
        )}
      </SidebarCard>

      <SidebarCard title="This week" icon={TrendingUp}>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-white/50">Total bookings</dt>
            <dd className="font-bold text-white">{stats.totalBookings}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-white/50">Available hours</dt>
            <dd className="font-bold text-emerald-400">{stats.availableHours}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-white/50">Peak day</dt>
            <dd className="font-bold text-white">{peakLabel}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-white/50">Most active</dt>
            <dd className="truncate font-bold text-white" title={stats.topTeam}>
              {stats.topTeam}
            </dd>
          </div>
        </dl>
      </SidebarCard>

      <SidebarCard title="Quick tip" icon={CalendarDays}>
        <p className="text-sm leading-relaxed text-white/55">
          Tap any open slot to book. Hover a booking card for session details — no
          personal data is shown publicly.
        </p>
      </SidebarCard>
    </aside>
  );
}