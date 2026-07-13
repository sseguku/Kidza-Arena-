"use client";

import {
  deleteBlockedSlotAction,
  deleteRecurringBookingAction,
  saveBlockedSlotAction,
  saveRecurringBookingAction,
} from "@/app/admin/availability/actions";
import { BrandCard } from "@/components/design-system";
import { DataTable } from "@/components/design-system/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DAY_NAMES } from "@/types/availability";
import type { BlockedSlot, RecurringBooking } from "@/types/availability";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type AdminAvailabilityManagerProps = {
  recurring: RecurringBooking[];
  blocked: BlockedSlot[];
};

export function AdminAvailabilityManager({
  recurring: initialRecurring,
  blocked: initialBlocked,
}: AdminAvailabilityManagerProps) {
  const router = useRouter();
  const [recurring, setRecurring] = useState(initialRecurring);
  const [blocked, setBlocked] = useState(initialBlocked);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [recDraft, setRecDraft] = useState({
    team_name: "",
    day_of_week: 1,
    start_time: "18:00",
    end_time: "19:00",
    booking_type: "team" as const,
  });

  const [blockDraft, setBlockDraft] = useState({
    block_date: "",
    start_time: "12:00",
    end_time: "14:00",
    reason: "Maintenance",
    is_recurring: false,
    day_of_week: 1,
  });

  useEffect(() => {
    setRecurring(initialRecurring);
    setBlocked(initialBlocked);
  }, [initialRecurring, initialBlocked]);

  const saveRecurring = () => {
    if (!recDraft.team_name.trim()) {
      setError("Team name is required.");
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await saveRecurringBookingAction({
        ...recDraft,
        active: true,
      });

      if (result.error || !result.data) {
        setError(result.error ?? "Failed to save recurring booking.");
        return;
      }

      setRecurring((prev) => {
        const without = prev.filter((item) => item.id !== result.data!.id);
        return [...without, result.data!];
      });
      setRecDraft({
        team_name: "",
        day_of_week: 1,
        start_time: "18:00",
        end_time: "19:00",
        booking_type: "team",
      });
      setSuccess(`${result.data.team_name} saved. Visible on the public calendar.`);
      router.refresh();
    });
  };

  const saveBlock = () => {
    if (!blockDraft.is_recurring && !blockDraft.block_date) {
      setError("Please select a date for the blocked slot.");
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await saveBlockedSlotAction({
        ...blockDraft,
        block_date: blockDraft.is_recurring ? null : blockDraft.block_date || null,
        day_of_week: blockDraft.is_recurring ? blockDraft.day_of_week : null,
        active: true,
      });

      if (result.error || !result.data) {
        setError(result.error ?? "Failed to save blocked slot.");
        return;
      }

      setBlocked((prev) => [result.data!, ...prev.filter((item) => item.id !== result.data!.id)]);
      setBlockDraft({
        block_date: "",
        start_time: "12:00",
        end_time: "14:00",
        reason: "Maintenance",
        is_recurring: false,
        day_of_week: 1,
      });
      setSuccess("Blocked slot saved. Visible on the public calendar.");
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
          role="status"
        >
          {success}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <BrandCard title="Recurring bookings">
          <p className="mb-4 text-sm text-muted-foreground">
            Weekly team slots appear on the public calendar. Each slot blocks new
            bookings until you delete it from this list.
          </p>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <Label>Team name</Label>
              <Input
                value={recDraft.team_name}
                onChange={(e) => setRecDraft((d) => ({ ...d, team_name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Day</Label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={recDraft.day_of_week}
                onChange={(e) =>
                  setRecDraft((d) => ({ ...d, day_of_week: parseInt(e.target.value, 10) }))
                }
              >
                {DAY_NAMES.map((day, i) => (
                  <option key={day} value={i}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Start</Label>
              <Input
                type="time"
                value={recDraft.start_time}
                onChange={(e) => setRecDraft((d) => ({ ...d, start_time: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>End</Label>
              <Input
                type="time"
                value={recDraft.end_time}
                onChange={(e) => setRecDraft((d) => ({ ...d, end_time: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={saveRecurring} disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add recurring
          </Button>
          <DataTable
            className="mt-4"
            data={recurring}
            emptyMessage="No recurring bookings."
            columns={[
              { key: "team", header: "Team", cell: (r) => r.team_name },
              {
                key: "day",
                header: "Day",
                cell: (r) => DAY_NAMES[r.day_of_week] ?? "—",
              },
              {
                key: "time",
                header: "Time",
                cell: (r) => `${r.start_time.slice(0, 5)} – ${r.end_time.slice(0, 5)}`,
              },
              {
                key: "status",
                header: "Status",
                cell: (r) => (
                  <Badge variant={r.active ? "default" : "secondary"}>
                    {r.active ? "Active" : "Inactive"}
                  </Badge>
                ),
              },
              {
                key: "actions",
                header: "",
                cell: (r) => (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      startTransition(async () => {
                        setError(null);
                        const result = await deleteRecurringBookingAction(r.id);
                        if (result.error) {
                          setError(result.error);
                          return;
                        }
                        setRecurring((prev) => prev.filter((x) => x.id !== r.id));
                        router.refresh();
                      })
                    }
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                ),
              },
            ]}
          />
        </BrandCard>

        <BrandCard title="Blocked slots">
          <p className="mb-4 text-sm text-muted-foreground">
            Block maintenance or one-off closures. These also show on the public
            calendar.
          </p>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <Label>Reason</Label>
              <Input
                value={blockDraft.reason}
                onChange={(e) => setBlockDraft((d) => ({ ...d, reason: e.target.value }))}
              />
            </div>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={blockDraft.is_recurring}
                onChange={(e) =>
                  setBlockDraft((d) => ({ ...d, is_recurring: e.target.checked }))
                }
              />
              <span className="text-sm">Recurring weekly block</span>
            </label>
            {!blockDraft.is_recurring && (
              <div className="space-y-1 sm:col-span-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={blockDraft.block_date}
                  onChange={(e) => setBlockDraft((d) => ({ ...d, block_date: e.target.value }))}
                />
              </div>
            )}
            {blockDraft.is_recurring && (
              <div className="space-y-1 sm:col-span-2">
                <Label>Day</Label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={blockDraft.day_of_week}
                  onChange={(e) =>
                    setBlockDraft((d) => ({
                      ...d,
                      day_of_week: parseInt(e.target.value, 10),
                    }))
                  }
                >
                  {DAY_NAMES.map((day, i) => (
                    <option key={day} value={i}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-1">
              <Label>Start</Label>
              <Input
                type="time"
                value={blockDraft.start_time}
                onChange={(e) => setBlockDraft((d) => ({ ...d, start_time: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>End</Label>
              <Input
                type="time"
                value={blockDraft.end_time}
                onChange={(e) => setBlockDraft((d) => ({ ...d, end_time: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={saveBlock} disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Block slot
          </Button>
          <DataTable
            className="mt-4"
            data={blocked}
            emptyMessage="No blocked slots."
            columns={[
              { key: "reason", header: "Reason", cell: (b) => b.reason ?? "—" },
              {
                key: "when",
                header: "When",
                cell: (b) =>
                  b.is_recurring
                    ? `Every ${DAY_NAMES[b.day_of_week ?? 0]}`
                    : (b.block_date ?? "—"),
              },
              {
                key: "time",
                header: "Time",
                cell: (b) => `${b.start_time.slice(0, 5)} – ${b.end_time.slice(0, 5)}`,
              },
              {
                key: "actions",
                header: "",
                cell: (b) => (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      startTransition(async () => {
                        setError(null);
                        const result = await deleteBlockedSlotAction(b.id);
                        if (result.error) {
                          setError(result.error);
                          return;
                        }
                        setBlocked((prev) => prev.filter((x) => x.id !== b.id));
                        router.refresh();
                      })
                    }
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                ),
              },
            ]}
          />
        </BrandCard>
      </div>
    </div>
  );
}
