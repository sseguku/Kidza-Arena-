import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  Calendar,
  Clock,
  Flame,
  Footprints,
  Heart,
  MapPin,
  Medal,
  PartyPopper,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Brand-aligned icon mapping by personality & domain */
export const brandIcons = {
  /** Competitive */
  competitive: Trophy,
  target: Target,
  medal: Medal,
  flame: Flame,
  /** Community */
  community: Users,
  heart: Heart,
  shield: Shield,
  /** Fun & Adventure */
  fun: PartyPopper,
  adventure: Sparkles,
  footprints: Footprints,
  star: Star,
  /** Affordable */
  affordable: BadgePercent,
  zap: Zap,
  /** Domain */
  pitch: Footprints,
  booking: Calendar,
  location: MapPin,
  time: Clock,
} as const satisfies Record<string, LucideIcon>;

export type BrandIconName = keyof typeof brandIcons;

const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "size-3.5",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
      "2xl": "size-10",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      pitch: "text-primary",
      adventure: "text-adventure",
      community: "text-community",
      value: "text-value-foreground",
      fun: "text-fun",
      success: "text-success",
      warning: "text-warning-foreground",
      destructive: "text-destructive",
      inherit: "text-current",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "inherit",
  },
});

type IconProps = VariantProps<typeof iconVariants> & {
  name: BrandIconName;
  className?: string;
  label?: string;
};

export function Icon({ name, size, tone, className, label }: IconProps) {
  const LucideIconComponent = brandIcons[name];

  return (
    <LucideIconComponent
      className={cn(iconVariants({ size, tone }), className)}
      aria-hidden={!label}
      aria-label={label}
    />
  );
}

export { iconVariants };
