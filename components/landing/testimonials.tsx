"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { GlassCard } from "@/components/landing/primitives/glass-card";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { testimonials } from "@/lib/constants/landing";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const current = testimonials[active]!;

  const prev = () =>
    setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () =>
    setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <SectionShell id="testimonials" variant="elevated">
      <Reveal>
        <SectionHeader
          eyebrow="Testimonials"
          headline="Loved by players across Kampala"
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative mt-16 lg:mt-24">
          <GlassCard strong className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="size-6 fill-[var(--landing-gold)] text-[var(--landing-gold)]"
                />
              ))}
            </div>

            <blockquote className="mt-8 font-display text-2xl leading-snug font-medium text-white sm:text-3xl lg:text-4xl lg:leading-snug">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="relative size-16 overflow-hidden rounded-full ring-2 ring-[var(--landing-gold)]/50 lg:size-20">
                <Image
                  src={current.photo}
                  alt={current.author}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xl font-bold text-white lg:text-2xl">
                  {current.author}
                </p>
                <p className="mt-1 text-[var(--landing-muted)]">{current.role}</p>
              </div>
            </div>
          </GlassCard>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex size-14 items-center justify-center rounded-full glass-panel text-white transition-all hover:scale-105 hover:border-gold/30"
            >
              <ChevronLeft className="size-6" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === active
                      ? "w-8 bg-[var(--landing-gold)]"
                      : "w-2 bg-white/30 hover:bg-white/50",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="flex size-14 items-center justify-center rounded-full glass-panel text-white transition-all hover:scale-105 hover:border-gold/30"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
