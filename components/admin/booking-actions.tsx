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
import { Check, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type BookingActionsProps = {
  booking: BookingRecord;
};

export function BookingActions({ booking }: BookingActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStatus = (status: BookingStatus) => {
    setActionError(null);
    startTransition(async () => {
      const result = await updateBookingStatusAction(booking.id, status);
      if (result.error) {
        setActionError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const handlePayment = (paymentStatus: PaymentStatus) => {
    startTransition(async () => {
      await updatePaymentStatusAction(booking.id, paymentStatus);
      router.refresh();
    });
  };

  const isPending = booking.status === "pending_approval";

  return (
    <div className="flex flex-col gap-2">
      {actionError && (
        <p className="max-w-xs text-xs text-destructive">{actionError}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
      {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      {isPending && (
        <>
          <Button
            size="sm"
            disabled={pending}
            onClick={() => handleStatus("confirmed")}
            className="gap-1"
          >
            <Check className="size-3.5" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => handleStatus("cancelled")}
            className="gap-1 border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            <X className="size-3.5" />
            Decline
          </Button>
        </>
      )}
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
          <SelectItem value="cancelled">Declined</SelectItem>
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
    </div>
  );
}
