import {
  Car,
  Clock,
  Coffee,
  GraduationCap,
  Lightbulb,
  Shield,
  ShowerHead,
  Toilet,
} from "lucide-react";
import { GlassCard } from "@/components/landing/primitives/glass-card";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { facilities } from "@/lib/constants/landing";

const iconMap = {
  zap: Lightbulb,
  location: Car,
  shield: Shield,
  heart: ShowerHead,
  community: Coffee,
  pitch: GraduationCap,
} as const;

const extraIcons: Record<string, typeof Clock> = {
  washrooms: Toilet,
  access: Clock,
};

export function FacilitiesSection() {
  return (
    <SectionShell id="facilities" variant="green">
      <Reveal>
        <SectionHeader
          eyebrow="World-Class Facilities"
          headline="Everything you need, nothing you don't"
          description="Premium amenities designed for players, spectators, and event hosts."
        />
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-8">
        {facilities.map((facility, i) => {
          const Icon =
            extraIcons[facility.id] ??
            iconMap[facility.icon as keyof typeof iconMap] ??
            Shield;
          return (
            <Reveal key={facility.id} delay={i * 0.05}>
              <GlassCard hover className="h-full">
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[var(--landing-green)]/20 lg:size-16">
                  <Icon className="size-7 text-[var(--landing-green-light)] lg:size-8" />
                </div>
                <h3 className="text-landing-card">{facility.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--landing-muted)] lg:text-lg">
                  {facility.description}
                </p>
              </GlassCard>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
