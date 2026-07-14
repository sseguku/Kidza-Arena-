import { BookingActions } from "@/components/admin/booking-actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/admin/booking-badges";
import { BrandCard } from "@/components/design-system";
import { DataTable } from "@/components/design-system/data-table";
import { formatTimeLabel } from "@/lib/booking/constants";
import { formatUGX } from "@/lib/booking/pricing";
import { listBookings } from "@/services/admin/bookings";
import type { BookingStatus, PaymentStatus } from "@/types/database";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ status?: string; payment?: string; q?: string }>;
};

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = (params.status as BookingStatus | "all") ?? "all";
  const payment = (params.payment as PaymentStatus | "all") ?? "all";

  const bookings = await listBookings({
    status: status === "all" ? undefined : status,
    payment: payment === "all" ? undefined : payment,
    search: params.q,
  });

  const filters = [
    { label: "All", status: "all", payment: "all" },
    { label: "Pending", status: "pending_approval", payment: "all" },
    { label: "Confirmed", status: "confirmed", payment: "all" },
    { label: "Unpaid", status: "all", payment: "unpaid" },
    { label: "Paid", status: "all", payment: "paid" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Bookings"
        description="Manage pitch reservations, approve requests, and track payments."
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active =
            (status === f.status || (f.status === "all" && !params.status)) &&
            (payment === f.payment || (f.payment === "all" && !params.payment));
          const href =
            f.status === "all" && f.payment === "all"
              ? "/admin/bookings"
              : `/admin/bookings?${new URLSearchParams({
                  ...(f.status !== "all" ? { status: f.status } : {}),
                  ...(f.payment !== "all" ? { payment: f.payment } : {}),
                }).toString()}`;

          return (
            <a
              key={f.label}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </a>
          );
        })}
      </div>

      <BrandCard title={`${bookings.length} bookings`}>
        <DataTable
          data={bookings}
          emptyMessage="No bookings match your filters."
          columns={[
            {
              key: "customer",
              header: "Customer",
              cell: (b) => (
                <div className="min-w-[140px]">
                  <p className="font-semibold">{b.full_name}</p>
                  <p className="text-xs text-muted-foreground">{b.phone}</p>
                  <p className="text-xs text-muted-foreground">{b.email}</p>
                </div>
              ),
            },
            {
              key: "session",
              header: "Session",
              cell: (b) => {
                const hour = parseInt(b.start_time.split(":")[0] ?? "0", 10);
                return (
                  <div className="text-sm">
                    <p className="font-medium capitalize">{b.booking_type}</p>
                    <p>{b.booking_date}</p>
                    <p className="text-muted-foreground">
                      {formatTimeLabel(hour)} · {b.duration_hours}h
                    </p>
                    {b.team_name && (
                      <p className="text-xs text-muted-foreground">{b.team_name}</p>
                    )}
                  </div>
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
              cell: (b) => (
                <span className="font-bold">{formatUGX(b.price_ugx)}</span>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              cell: (b) => <BookingActions booking={b} />,
            },
          ]}
        />
      </BrandCard>
    </div>
  );
}
