import { SLOT_STATUS_COLORS, type SlotStatus } from "@/types/availability";
import { cn } from "@/lib/utils";

export function AvailabilityLegend({ className }: { className?: string }) {
  const items: SlotStatus[] = [
    "available",
    "booked",
    "pending",
    "blocked",
    "cancelled",
  ];

  return (
    <div
      className={cn("flex flex-wrap gap-3 sm:gap-4", className)}
      role="list"
      aria-label="Availability legend"
    >
      {items.map((status) => {
        const config = SLOT_STATUS_COLORS[status];
        return (
          <div key={status} className="flex items-center gap-2" role="listitem">
            <span
              className={cn(
                "size-3 rounded-full border",
                config.bg,
                config.border,
              )}
              aria-hidden
            />
            <span className="text-xs font-medium text-white/70 sm:text-sm">
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function getSlotClassName(status: SlotStatus): string {
  const c = SLOT_STATUS_COLORS[status];
  return cn("border", c.bg, c.border, c.text);
}
