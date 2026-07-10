"use client";

import {
  updateBookingStatusAction,
  updatePaymentStatusAction,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookingRecord } from "@/types/booking";
import type { BookingStatus, PaymentStatus } from "@/types/database";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";

type BookingActionsProps = {
  booking: BookingRecord;
};

export function BookingActions({ booking }: BookingActionsProps) {
  const [pending, startTransition] = useTransition();

  const handleStatus = (status: BookingStatus) => {
    startTransition(async () => {
      await updateBookingStatusAction(booking.id, status);
    });
  };

  const handlePayment = (paymentStatus: PaymentStatus) => {
    startTransition(async () => {
      await updatePaymentStatusAction(booking.id, paymentStatus);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      <Select
        value={booking.status}
        onValueChange={(v) => handleStatus(v as BookingStatus)}
        disabled={pending}
      >
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending_approval">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={booking.payment_status}
        onValueChange={(v) => handlePayment(v as PaymentStatus)}
        disabled={pending}
      >
        <SelectTrigger className="h-9 w-[110px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unpaid">Unpaid</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="refunded">Refunded</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="ghost" size="sm" asChild>
        <a href={`tel:${booking.phone.replace(/\s/g, "")}`}>Call</a>
      </Button>
    </div>
  );
}
