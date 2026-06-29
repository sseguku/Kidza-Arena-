/**
 * Kidza Arena design tokens — single source of truth for programmatic access.
 * CSS variables in app/globals.css mirror these values.
 */

export const brand = {
  tagline: "More Than a Pitch. It's an Adventure.",
  personality: ["Affordable", "Community", "Competitive", "Fun"] as const,
} as const;

export const colors = {
  pitch: "var(--pitch)",
  adventure: "var(--adventure)",
  community: "var(--community)",
  value: "var(--value)",
  fun: "var(--fun)",
  success: "var(--success)",
  warning: "var(--warning)",
  info: "var(--info)",
  destructive: "var(--destructive)",
} as const;

export const gradients = {
  adventure: "var(--gradient-adventure)",
  pitch: "var(--gradient-pitch)",
  community: "var(--gradient-community)",
  hero: "var(--gradient-hero)",
} as const;

/** 4px base spacing scale */
export const spacing = {
  0: "0px",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
} as const;

export const radius = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  full: "var(--radius-full)",
} as const;

export const typography = {
  display: {
    xl: "text-display-xl",
    lg: "text-display-lg",
    md: "text-display-md",
    sm: "text-display-sm",
  },
  heading: {
    lg: "text-heading-lg",
    md: "text-heading-md",
    sm: "text-heading-sm",
  },
  body: {
    lg: "text-body-lg",
    md: "text-body-md",
    sm: "text-body-sm",
  },
  caption: "text-caption",
  eyebrow: "text-eyebrow",
} as const;

export const motion = {
  ease: {
    bounce: "var(--ease-kidza-bounce)",
    smooth: "var(--ease-kidza-smooth)",
  },
  duration: {
    fast: "var(--duration-kidza-fast)",
    base: "var(--duration-kidza-base)",
    slow: "var(--duration-kidza-slow)",
  },
  animation: {
    bounceIn: "animate-kidza-bounce-in",
    fadeUp: "animate-kidza-fade-up",
    fadeIn: "animate-kidza-fade-in",
    pulseSoft: "animate-kidza-pulse-soft",
    shimmer: "animate-kidza-shimmer",
    wiggle: "animate-kidza-wiggle",
  },
} as const;

export type BrandPersonality = (typeof brand.personality)[number];
export type SpacingKey = keyof typeof spacing;
