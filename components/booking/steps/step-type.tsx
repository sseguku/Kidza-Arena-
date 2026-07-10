"use client";

import { GlassCard } from "@/components/landing/primitives/glass-card";
import {
  landingButtonSizes,
  landingButtonVariants,
} from "@/components/landing/primitives/button";
import {
  INDIVIDUAL_PRICE_UGX,
  TEAM_HOURLY_PRICE_UGX,
} from "@/lib/booking/constants";
import { formatUGX } from "@/lib/booking/pricing";
import { cn } from "@/lib/utils";
import type { BookingType } from "@/types/booking";
import { motion } from "framer-motion";
import { Users, Trophy } from "lucide-react";

type StepTypeProps = {
  value: BookingType | null;
  onSelect: (type: BookingType) => void;
  error?: string;
};

const cards = [
  {
    type: "individual" as const,
    emoji: "🏃",
    title: "Individual Play",
    description:
      "Perfect for players looking to join a game or book an individual playing session.",
    price: `${formatUGX(INDIVIDUAL_PRICE_UGX)} per person per play`,
    cta: "Book Individual",
    icon: Users,
  },
  {
    type: "team" as const,
    emoji: "⚽",
    title: "Team Booking",
    description:
      "Reserve the entire pitch for your team, training session, friendly match, or tournament.",
    price: `${formatUGX(TEAM_HOURLY_PRICE_UGX)} per hour`,
    cta: "Book Team",
    icon: Trophy,
  },
];

export function StepType({ value, onSelect, error }: StepTypeProps) {
  return (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          What would you like to book?
        </h2>
        <p className="mt-2 text-base text-white/60 sm:text-lg">
          Choose the experience that fits your game.
        </p>
      </header>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {cards.map((card, index) => {
          const selected = value === card.type;
          const Icon = card.icon;

          return (
            <motion.div
              key={card.type}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <button
                type="button"
                onClick={() => onSelect(card.type)}
                className={cn(
                  "group w-full text-left transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--landing-bg)]",
                  selected && "scale-[1.02]",
                )}
              >
                <GlassCard
                  hover
                  strong={selected}
                  className={cn(
                    "relative h-full cursor-pointer border-2 transition-all duration-300",
                    selected
                      ? "border-[var(--landing-gold)] shadow-glow-gold"
                      : "border-transparent hover:border-white/20",
                  )}
                >
                  {selected && (
                    <span className="absolute right-4 top-4 rounded-full bg-[var(--landing-gold)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0b0f14]">
                      Selected
                    </span>
                  )}

                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl sm:text-5xl" aria-hidden>
                        {card.emoji}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="size-5 text-[var(--landing-green)]" />
                          <h3 className="text-xl font-bold text-white sm:text-2xl">
                            {card.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/5 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                        Price
                      </p>
                      <p className="mt-1 text-lg font-bold text-[var(--landing-gold)]">
                        {card.price}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "inline-flex w-full items-center justify-center gap-2.5 rounded-full font-bold",
                        landingButtonSizes.lg,
                        landingButtonVariants[selected ? "gold" : "primary"],
                      )}
                      aria-hidden
                    >
                      {card.cta}
                    </span>
                  </div>
                </GlassCard>
              </button>
            </motion.div>
          );
        })}
      </div>

      {error && (
        <p className="text-center text-sm font-medium text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
