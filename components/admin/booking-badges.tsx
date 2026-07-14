import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BookingStatus, PaymentStatus } from "@/types/database";

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending_approval: {
    label: "Pending",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  cancelled: {
    label: "Declined",
    className: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  },
};

const paymentConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  unpaid: {
    label: "Unpaid",
    className: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  refunded: {
    label: "Refunded",
    className: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
  },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("font-semibold", config.className)}>
      {config.label}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = paymentConfig[status];
  return (
    <Badge variant="outline" className={cn("font-semibold", config.className)}>
      {config.label}
    </Badge>
  );
}
