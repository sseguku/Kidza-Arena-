import { GlassCard } from "@/components/landing/primitives/glass-card";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { whyKidza } from "@/lib/constants/landing";
import { cn } from "@/lib/utils";

export function WhyKidzaSection() {
  return (
    <SectionShell id="why" variant="gradient">
      <Reveal>
        <SectionHeader
          eyebrow={whyKidza.eyebrow}
          headline={whyKidza.headline}
          description={whyKidza.description}
        />
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-24 lg:gap-8">
        {whyKidza.pillars.map((pillar, i) => (
          <Reveal key={pillar.id} delay={i * 0.08}>
            <GlassCard hover className="h-full">
              <div
                className={cn(
                  "mb-4 inline-flex rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider",
                  pillar.accent === "gold"
                    ? "bg-[var(--landing-gold)]/15 text-gold"
                    : "bg-[var(--landing-green)]/20 text-[var(--landing-green-light)]",
                )}
              >
                {pillar.title}
              </div>
              <h3 className="text-landing-card">{pillar.title}</h3>
              <p className="mt-4 text-landing-body text-[var(--landing-muted)]">
                {pillar.description}
              </p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
