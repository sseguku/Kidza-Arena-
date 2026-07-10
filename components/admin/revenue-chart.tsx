import type { MonthlyRevenue } from "@/services/admin/stats";
import { formatUGX } from "@/lib/booking/pricing";

type RevenueChartProps = {
  data: MonthlyRevenue[];
};

export function RevenueChart({ data }: RevenueChartProps) {
  const max = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="flex h-56 items-end gap-2 pt-4 sm:gap-3">
      {data.map((item) => (
        <div
          key={item.month}
          className="flex flex-1 flex-col items-center gap-2"
          title={`${item.month}: ${formatUGX(item.revenue)} (${item.count} bookings)`}
        >
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/60 transition-all"
              style={{
                height: `${Math.max((item.revenue / max) * 100, item.revenue > 0 ? 8 : 0)}%`,
                minHeight: item.revenue > 0 ? "0.5rem" : 0,
              }}
            />
          </div>
          <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
            {item.month}
          </span>
        </div>
      ))}
    </div>
  );
}
