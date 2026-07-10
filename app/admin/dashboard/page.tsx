import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/admin/booking-badges";
import { BrandCard, StatCard } from "@/components/design-system";
import { DataTable } from "@/components/design-system/data-table";
import { Button } from "@/components/ui/button";
import { formatTimeLabel } from "@/lib/booking/constants";
import { formatUGX } from "@/lib/booking/pricing";
import { listBookings } from "@/services/admin/bookings";
import { getBookingStats } from "@/services/admin/stats";
import { CalendarDays, Clock, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [stats, recentBookings] = await Promise.all([
    getBookingStats(),
    listBookings({ limit: 8 }),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back. Here's what's happening at Kidza Arena today."
        action={
          <Button asChild size="lg">
            <Link href="/admin/bookings">View all bookings</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pending approval"
          value={String(stats.pending)}
          hint={`${stats.todayBookings} bookings today`}
          variant="pitch"
        />
        <StatCard
          label="Confirmed"
          value={String(stats.confirmed)}
          hint={`${stats.thisWeekBookings} this week`}
        />
        <StatCard
          label="Revenue collected"
          value={formatUGX(stats.revenuePaid)}
          hint="Paid bookings"
          variant="value"
        />
        <StatCard
          label="Outstanding"
          value={formatUGX(stats.revenuePending)}
          hint="Awaiting payment"
          variant="adventure"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BrandCard title="Quick actions" className="lg:col-span-1">
          <div className="grid gap-2">
            {[
              { href: "/admin/bookings?status=pending_approval", label: "Review pending", icon: Clock },
              { href: "/admin/calendar", label: "Open calendar", icon: CalendarDays },
              { href: "/admin/pricing", label: "Update pricing", icon: Wallet },
              { href: "/admin/statistics", label: "View statistics", icon: TrendingUp },
            ].map(({ href, label, icon: Icon }) => (
              <Button key={href} variant="outline" className="justify-start" asChild>
                <Link href={href}>
                  <Icon className="size-4" />
                  {label}
                </Link>
              </Button>
            ))}
          </div>
        </BrandCard>

        <BrandCard
          title="Recent bookings"
          description="Latest reservation requests"
          className="lg:col-span-2"
          headerAction={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/bookings">See all</Link>
            </Button>
          }
        >
          <DataTable
            data={recentBookings}
            emptyMessage="No bookings yet."
            columns={[
              {
                key: "customer",
                header: "Customer",
                cell: (b) => (
                  <div>
                    <p className="font-semibold">{b.full_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {b.booking_type}
                    </p>
                  </div>
                ),
              },
              {
                key: "when",
                header: "When",
                cell: (b) => {
                  const hour = parseInt(b.start_time.split(":")[0] ?? "0", 10);
                  return (
                    <span className="text-sm">
                      {b.booking_date}
                      <br />
                      <span className="text-muted-foreground">
                        {formatTimeLabel(hour)}
                      </span>
                    </span>
                  );
                },
              },
              {
                key: "status",
                header: "Status",
                cell: (b) => (
                  <div className="flex flex-col gap-1">
                    <BookingStatusBadge status={b.status} />
                    <PaymentStatusBadge status={b.payment_status} />
                  </div>
                ),
              },
              {
                key: "price",
                header: "Price",
                className: "text-right",
                cell: (b) => (
                  <span className="font-semibold">{formatUGX(b.price_ugx)}</span>
                ),
              },
            ]}
          />
        </BrandCard>
      </div>
    </div>
  );
}
