import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { BrandCard, StatCard } from "@/components/design-system";
import { formatUGX } from "@/lib/booking/pricing";
import {
  getBookingStats,
  getBookingTypeBreakdown,
  getMonthlyRevenue,
} from "@/services/admin/stats";

export default async function AdminStatisticsPage() {
  const [stats, monthly, breakdown] = await Promise.all([
    getBookingStats(),
    getMonthlyRevenue(6),
    getBookingTypeBreakdown(),
  ]);

  const maxType = Math.max(...breakdown.map((b) => b.count), 1);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Statistics"
        description="Track revenue, booking trends, and session breakdowns."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total bookings" value={String(stats.total)} />
        <StatCard
          label="Conversion rate"
          value={
            stats.total > 0
              ? `${Math.round((stats.confirmed / stats.total) * 100)}%`
              : "0%"
          }
          hint="Confirmed / total"
        />
        <StatCard label="Cancelled" value={String(stats.cancelled)} variant="adventure" />
        <StatCard
          label="Avg. paid booking"
          value={
            stats.confirmed > 0
              ? formatUGX(Math.round(stats.revenuePaid / stats.confirmed))
              : formatUGX(0)
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BrandCard title="Monthly revenue" description="Paid bookings, last 6 months">
          <RevenueChart data={monthly} />
        </BrandCard>

        <BrandCard title="Booking types" description="Individual vs team sessions">
          <div className="space-y-4 pt-2">
            {breakdown.map((item) => (
              <div key={item.type} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{item.type}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(item.count / maxType) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </BrandCard>
      </div>

      <BrandCard title="Revenue summary">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Collected</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatUGX(stats.revenuePaid)}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatUGX(stats.revenuePending)}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">This week</p>
            <p className="text-2xl font-bold">{stats.thisWeekBookings} bookings</p>
          </div>
        </div>
      </BrandCard>
    </div>
  );
}
