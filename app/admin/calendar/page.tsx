import { Suspense } from "react";
import { AdminCalendar } from "@/components/admin/admin-calendar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getMonthAvailability } from "@/services/availability";

type PageProps = {
  searchParams: Promise<{ year?: string; month?: string }>;
};

async function CalendarContent({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const monthData = await getMonthAvailability(year, month);
  return (
    <AdminCalendar
      year={year}
      month={month}
      slotsByDate={monthData.slotsByDate}
    />
  );
}

export default async function AdminCalendarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const month = params.month ? parseInt(params.month, 10) : now.getMonth() + 1;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Calendar"
        description="Bookings, recurring team slots, and blocked times across the month."
      />
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center rounded-2xl border border-border bg-muted/20">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <CalendarContent year={year} month={month} />
      </Suspense>
    </div>
  );
}
