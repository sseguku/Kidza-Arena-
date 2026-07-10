import { AvailabilityLegend } from "@/components/availability/availability-legend";
import { LandingButton } from "@/components/landing/primitives/button";
import { GlassCard } from "@/components/landing/primitives/glass-card";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { formatTimeLabel } from "@/lib/booking/constants";
import { getSlotClassName } from "@/components/availability/availability-legend";
import { getAvailabilityPreview } from "@/services/availability";
import { cn } from "@/lib/utils";
import { Calendar, Clock, TrendingUp } from "lucide-react";

export async function AvailabilityPreviewSection() {
  const preview = await getAvailabilityPreview();
  const today = new Date().toISOString().split("T")[0]!;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0]!;
  });

  const slotsByDay = weekDays.map((date) => ({
    date,
    label: new Date(date).toLocaleDateString("en-UG", { weekday: "short" }),
    count: preview.weekSlots.filter((s) => s.date === date).length,
    slots: preview.weekSlots.filter((s) => s.date === date).slice(0, 2),
  }));

  return (
    <SectionShell id="availability">
      <Reveal>
        <SectionHeader
          eyebrow="Live Schedule"
          headline="Pitch Availability"
          description="See available and booked time slots before making your reservation."
        />
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <GlassCard strong className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-white">{preview.monthLabel}</h3>
              <AvailabilityLegend />
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {slotsByDay.map((day) => {
                const isToday = day.date === today;
                return (
                  <div
                    key={day.date}
                    className={cn(
                      "rounded-xl border border-white/10 p-2 sm:p-3",
                      isToday && "border-[var(--landing-gold)]/40 bg-[var(--landing-gold)]/5",
                    )}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 sm:text-xs">
                      {day.label}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-lg font-bold sm:text-xl",
                        isToday ? "text-[var(--landing-gold)]" : "text-white",
                      )}
                    >
                      {day.date.slice(8)}
                    </p>
                    <p className="mt-1 text-[10px] text-white/40 sm:text-xs">
                      {day.count} booked
                    </p>
                    <div className="mt-2 hidden space-y-1 sm:block">
                      {day.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={cn(
                            "truncate rounded px-1 py-0.5 text-[10px] font-medium",
                            getSlotClassName(slot.status),
                          )}
                        >
                          {slot.teamName}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1} className="space-y-4">
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--landing-green)]">
              <Clock className="size-5" />
              <h3 className="font-bold text-white">Today&apos;s schedule</h3>
            </div>
            {preview.todaySlots.length === 0 ? (
              <p className="text-sm text-white/50">No bookings yet today.</p>
            ) : (
              <ul className="space-y-2">
                {preview.todaySlots.slice(0, 4).map((slot) => {
                  const hour = parseInt(slot.startTime.split(":")[0] ?? "0", 10);
                  return (
                    <li
                      key={slot.id}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm",
                        getSlotClassName(slot.status),
                      )}
                    >
                      <span className="font-semibold">{slot.teamName}</span>
                      <span className="ml-2 opacity-70">
                        {formatTimeLabel(hour)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </GlassCard>

          <GlassCard className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--landing-gold)]">
              <TrendingUp className="size-5" />
              <h3 className="font-bold text-white">Quick stats</h3>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/5 p-3">
                <dt className="text-white/50">This week</dt>
                <dd className="text-2xl font-bold text-white">
                  {preview.weekBookingCount}
                </dd>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <dt className="text-white/50">Next open</dt>
                <dd className="text-sm font-bold text-[var(--landing-gold)]">
                  {preview.nextAvailable
                    ? formatTimeLabel(
                        parseInt(
                          preview.nextAvailable.startTime.split(":")[0] ?? "0",
                          10,
                        ),
                      )
                    : "—"}
                </dd>
              </div>
            </dl>
          </GlassCard>

          <LandingButton href="/availability" variant="gold" size="lg" className="w-full">
            <Calendar className="size-5" />
            View Full Availability
          </LandingButton>
        </Reveal>
      </div>
    </SectionShell>
  );
}
