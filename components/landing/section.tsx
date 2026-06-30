"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Viewport-triggered fade-up — runs once, respects reduced motion. */
export function SectionReveal({
  children,
  className,
  delay = 0,
}: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  headline: string;
  description?: string;
  align?: "left" | "center";
  brand?: "pitch" | "adventure" | "community" | "value" | "fun";
  id?: string;
};

export function SectionHeader({
  eyebrow,
  headline,
  description,
  align = "center",
  brand,
  id,
}: SectionHeaderProps) {
  return (
    <header
      id={id}
      className={cn(
        "max-w-4xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-eyebrow",
            brand === "pitch" && "text-primary",
            brand === "adventure" && "text-adventure",
            brand === "community" && "text-community",
            brand === "value" && "text-value-foreground",
            brand === "fun" && "text-fun",
            !brand && "text-muted-foreground",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="mt-5 text-section-title">{headline}</h2>
      {description && (
        <p className="mt-6 max-w-3xl text-subtitle text-pretty text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  );
}

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "muted" | "dark" | "gradient";
};

export function SectionShell({
  children,
  className,
  id,
  variant = "default",
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-spacing",
        variant === "default" && "bg-background",
        variant === "muted" && "bg-muted/40",
        variant === "dark" && "bg-foreground text-background",
        variant === "gradient" && "bg-gradient-hero",
        className,
      )}
    >
      <div className="container-premium">{children}</div>
    </section>
  );
}
