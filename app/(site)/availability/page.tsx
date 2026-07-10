import { AvailabilityCalendar } from "@/components/availability/availability-calendar";
import { LandingButton } from "@/components/landing/primitives/button";
import { getMonthAvailability } from "@/services/availability";
import { toPublicSlotDetail } from "@/services/availability";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Pitch Availability",
  description:
    "View Kidza Arena pitch availability. See booked and open time slots before you reserve.",
  path: "/availability",
});

export default async function AvailabilityPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const monthData = await getMonthAvailability(year, month);
  const publicSlots: Record<string, ReturnType<typeof toPublicSlotDetail>[]> = {};
  for (const [date, slots] of Object.entries(monthData.slotsByDate)) {
    publicSlots[date] = slots.map(toPublicSlotDetail);
  }

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgb(17 122 61 / 0.35), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-6xl space-y-8">
        <header className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--landing-green)]">
            Live Calendar
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Pitch Availability
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-white/60 sm:text-lg">
            Browse the full schedule by month, week, or day. Green slots are
            open — red and orange are already taken or pending.
          </p>
        </header>

        <AvailabilityCalendar
          initialYear={year}
          initialMonth={month}
          initialMonthData={publicSlots}
        />

        <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
          <LandingButton href="/book" variant="gold" size="xl">
            Book a Slot
          </LandingButton>
          <LandingButton href="/" variant="outline" size="lg">
            Back to Home
          </LandingButton>
        </div>
      </div>
    </section>
  );
}
