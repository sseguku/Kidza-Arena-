"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
};

const offsets = {
  up: { y: 32, x: 0, scale: 1 },
  left: { y: 0, x: -32, scale: 1 },
  right: { y: 0, x: 32, scale: 1 },
  scale: { y: 0, x: 0, scale: 0.96 },
};

/** Scroll-triggered reveal — once, subtle, accessible. */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const offset = offsets[direction];

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: offset.y, x: offset.x, scale: offset.scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
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
  eyebrowClassName?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  headline,
  description,
  align = "center",
  eyebrowClassName,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "max-w-4xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-landing-eyebrow text-gold",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="mt-5 text-landing-section">{headline}</h2>
      {description && (
        <p className="mt-6 text-landing-body text-pretty text-[var(--landing-muted)] lg:mt-8">
          {description}
        </p>
      )}
    </header>
  );
}

type SectionShellProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  variant?: "default" | "elevated" | "green" | "gradient";
};

export function SectionShell({
  children,
  id,
  className,
  variant = "default",
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "landing-section",
        variant === "default" && "bg-[var(--landing-bg)]",
        variant === "elevated" && "bg-[#0e141c]",
        variant === "green" &&
          "bg-gradient-to-b from-[#0b1a12] to-[var(--landing-bg)]",
        variant === "gradient" &&
          "bg-gradient-to-b from-[var(--landing-bg)] via-[#0d1520] to-[var(--landing-bg)]",
        className,
      )}
    >
      <div className="landing-container">{children}</div>
    </section>
  );
}
