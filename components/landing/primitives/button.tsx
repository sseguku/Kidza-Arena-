import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-bold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--landing-bg)] disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary:
    "bg-[var(--landing-green)] text-white shadow-glow-green hover:scale-[1.03] hover:bg-[var(--landing-green-light)] hover:shadow-lg active:scale-[0.98]",
  gold: "bg-[var(--landing-gold)] text-[#0b0f14] shadow-glow-gold hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]",
  outline:
    "border-2 border-white/25 bg-white/5 text-white backdrop-blur-md hover:scale-[1.03] hover:border-white/40 hover:bg-white/10 active:scale-[0.98]",
  ghost:
    "text-white/80 hover:bg-white/10 hover:text-white",
  whatsapp:
    "bg-[#25D366] text-white hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]",
} as const;

const sizes = {
  default: "h-12 min-h-12 px-7 text-base lg:text-lg",
  lg: "h-14 min-h-14 px-9 text-lg",
  xl: "h-16 min-h-16 px-11 text-lg lg:text-xl",
} as const;

type LandingButtonProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function LandingButton({
  className,
  variant = "primary",
  size = "default",
  ...props
}: LandingButtonProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

type LandingButtonNativeProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function LandingButtonNative({
  className,
  variant = "primary",
  size = "default",
  ...props
}: LandingButtonNativeProps) {
  return (
    <button
      type="button"
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export { variants as landingButtonVariants, sizes as landingButtonSizes };
