import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
};

/** Glassmorphism card for premium landing sections. */
export function GlassCard({
  children,
  className,
  strong = false,
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl p-6 sm:p-8 lg:p-10",
        strong ? "glass-panel-strong" : "glass-panel",
        hover &&
          "transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-landing",
        className,
      )}
    >
      {children}
    </div>
  );
}
