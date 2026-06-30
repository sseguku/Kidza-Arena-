"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Shield, Sparkles, Trophy } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { AnimatedCounter } from "@/components/landing/primitives/animated-counter";
import { LandingButton } from "@/components/landing/primitives/button";
import { hero } from "@/lib/constants/landing";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const badgeIcons = [Trophy, Sparkles, Shield];

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const item = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 40 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.15 + i * 0.12,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        }),
      };

  const content = (
    <>
      <p className="text-landing-eyebrow text-gold">{hero.eyebrow}</p>
      <h1 className="mt-6 text-landing-hero">
        {hero.headline.split(" ").map((word, i, arr) =>
          i === arr.length - 2 ? (
            <span key={i} className="text-gradient-gold">
              {word}{" "}
            </span>
          ) : (
            <span key={i}>{word} </span>
          ),
        )}
      </h1>
      <p className="mt-8 max-w-2xl text-landing-body text-white/80">
        {hero.subheadline}
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center lg:mt-12">
        <LandingButton href="/book" variant="gold" size="xl" className="w-full sm:w-auto">
          {hero.primaryCta}
        </LandingButton>
        <LandingButton
          href="#gallery"
          variant="outline"
          size="xl"
          className="w-full sm:w-auto"
        >
          {hero.secondaryCta}
        </LandingButton>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {hero.badges.map((badge, i) => {
          const Icon = badgeIcons[i] ?? Trophy;
          return (
            <span
              key={badge}
              className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white/90"
            >
              <Icon className="size-4 text-gold" />
              {badge}
            </span>
          );
        })}
      </div>
    </>
  );

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-[100dvh] items-end overflow-hidden"
    >
      <Image
        src={hero.posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={hero.posterSrc}
        className="absolute inset-0 size-full object-cover"
        aria-hidden
      >
        <source src={hero.videoSrc} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/70 to-[#0B0F14]/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14]/80 via-transparent to-transparent" />

      <div className="relative z-10 landing-container w-full pb-32 pt-36 lg:pb-40 lg:pt-44">
        <div className="max-w-5xl">
          {item ? (
            <>
              {[hero.eyebrow, hero.headline, hero.subheadline].map((_, idx) =>
                idx === 0 ? (
                  <motion.div key="eyebrow" custom={0} initial="hidden" animate="visible" variants={item}>
                    <p className="text-landing-eyebrow text-gold">{hero.eyebrow}</p>
                  </motion.div>
                ) : idx === 1 ? (
                  <motion.h1 key="headline" custom={1} initial="hidden" animate="visible" variants={item} className="mt-6 text-landing-hero">
                    The best football venue in{" "}
                    <span className="text-gradient-gold">Kampala.</span>
                  </motion.h1>
                ) : null,
              )}
              <motion.p custom={2} initial="hidden" animate="visible" variants={item} className="mt-8 max-w-2xl text-landing-body text-white/80">
                {hero.subheadline}
              </motion.p>
              <motion.div custom={3} initial="hidden" animate="visible" variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center lg:mt-12">
                <LandingButton href="/book" variant="gold" size="xl" className="w-full sm:w-auto">
                  {hero.primaryCta}
                </LandingButton>
                <LandingButton href="#gallery" variant="outline" size="xl" className="w-full sm:w-auto">
                  {hero.secondaryCta}
                </LandingButton>
              </motion.div>
              <motion.div custom={4} initial="hidden" animate="visible" variants={item} className="mt-8 flex flex-wrap gap-3">
                {hero.badges.map((badge, i) => {
                  const Icon = badgeIcons[i] ?? Trophy;
                  return (
                    <span key={badge} className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white/90">
                      <Icon className="size-4 text-gold" />
                      {badge}
                    </span>
                  );
                })}
              </motion.div>
            </>
          ) : (
            content
          )}
        </div>

        {/* Floating stats */}
        <div className="mt-16 grid grid-cols-2 gap-4 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {hero.stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
              className="glass-panel-strong rounded-2xl p-5 lg:p-6"
            >
              <p className="font-display text-2xl font-bold text-white lg:text-3xl">
                {typeof stat.value === "number" ? (
                  <AnimatedCounter
                    value={stat.value}
                    suffix={"suffix" in stat ? stat.suffix : undefined}
                  />
                ) : (
                  stat.value
                )}
              </p>
              <p className="mt-1 text-sm text-[var(--landing-muted)] lg:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <a
        href="#trusted"
        className={cn(
          "absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-gold lg:bottom-12",
          !prefersReducedMotion && "animate-kidza-pulse-soft",
        )}
        aria-label="Scroll to content"
      >
        <span className="text-xs font-semibold tracking-widest uppercase">Scroll</span>
        <ChevronDown className="size-6" strokeWidth={1.5} />
      </a>
    </section>
  );
}
