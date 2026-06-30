import Image from "next/image";
import { Trophy } from "lucide-react";
import { GlassCard } from "@/components/landing/primitives/glass-card";
import { LandingButton } from "@/components/landing/primitives/button";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { tournaments } from "@/lib/constants/landing";

export function TournamentsSection() {
  return (
    <SectionShell id="tournaments" variant="gradient">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal direction="left">
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl lg:min-h-[560px]">
            <Image
              src={tournaments.image}
              alt="Tournament at Kidza Arena"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0F14]/70 to-transparent" />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionHeader
              eyebrow={tournaments.eyebrow}
              headline={tournaments.headline}
              description={tournaments.description}
              align="left"
            />
          </Reveal>

          <div className="mt-12 space-y-5 lg:mt-16">
            {tournaments.events.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.08}>
                <GlassCard hover className="flex items-start gap-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-gold)]/15">
                    <Trophy className="size-6 text-gold" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-landing-card">{event.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-4 text-base text-[var(--landing-muted)] lg:text-lg">
                      <span>{event.date}</span>
                      <span>{event.teams}</span>
                      <span className="font-semibold text-gold">{event.prize}</span>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.25}>
            <LandingButton
              href="/contact"
              variant="primary"
              size="xl"
              className="mt-12 lg:mt-16"
            >
              Register Your Team
            </LandingButton>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
