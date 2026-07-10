"use client";

import { cn } from "@/lib/utils";
import { formatUGX } from "@/lib/booking/pricing";
import { motion } from "framer-motion";

type BookingPriceBadgeProps = {
  amount: number;
  label?: string;
  className?: string;
};

export function BookingPriceBadge({
  amount,
  label = "Estimated total",
  className,
}: BookingPriceBadgeProps) {
  return (
    <motion.div
      key={amount}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl border border-[var(--landing-gold)]/30 bg-[var(--landing-gold)]/10 px-5 py-4",
        className,
      )}
    >
      <span className="text-sm font-medium text-white/70">{label}</span>
      <span className="text-xl font-bold text-[var(--landing-gold)] sm:text-2xl">
        {formatUGX(amount)}
      </span>
    </motion.div>
  );
}
