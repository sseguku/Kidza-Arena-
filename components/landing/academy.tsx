import Image from "next/image";
import { Check } from "lucide-react";
import { GlassCard } from "@/components/landing/primitives/glass-card";
import { LandingButton } from "@/components/landing/primitives/button";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { academy } from "@/lib/constants/landing";

export function AcademySection() {
  return (
    <SectionShell id="academy" variant="green">
      <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]">
        <div className="absolute inset-0">
          <Image
            src={academy.image}
            alt="Kidza Football Academy training"
            fill
            sizes="100vw"
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14] via-[#0B0F14]/85 to-[#0B0F14]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-[#0B0F14]/30" />
        </div>

        <div className="relative z-10 px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
          <Reveal>
            <SectionHeader
              eyebrow={academy.eyebrow}
              headline={academy.headline}
              description={academy.description}
              align="left"
              eyebrowClassName="text-gold"
            />
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 grid gap-4 lg:mt-16 lg:max-w-xl">
              {academy.schedule.map((slot) => (
                <GlassCard key={slot.group} strong className="flex items-center justify-between gap-4 py-5">
                  <div>
                    <p className="font-display text-xl font-bold text-white lg:text-2xl">
                      {slot.group}
                    </p>
                    <p className="mt-1 text-[var(--landing-muted)]">{slot.day}</p>
                  </div>
                  <p className="text-lg font-semibold text-gold">{slot.time}</p>
                </GlassCard>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-wrap items-center gap-4 lg:mt-16">
              <LandingButton href="/contact" variant="gold" size="xl">
                {academy.cta}
              </LandingButton>
              <span className="inline-flex items-center gap-2 text-lg text-white/80">
                <Check className="size-5 text-[var(--landing-green-light)]" />
                UEFA-Licensed Coaches
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
