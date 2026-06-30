import Image from "next/image";
import { GlassCard } from "@/components/landing/primitives/glass-card";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { matchHighlights } from "@/lib/constants/landing";

export function MatchHighlightsSection() {
  return (
    <SectionShell id="highlights" variant="elevated">
      <Reveal>
        <SectionHeader
          eyebrow={matchHighlights.eyebrow}
          headline={matchHighlights.headline}
        />
      </Reveal>

      <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-3 lg:gap-10">
        {matchHighlights.matches.map((match, i) => (
          <Reveal key={match.id} delay={i * 0.1}>
            <GlassCard hover className="group overflow-hidden p-0">
              <div className="relative min-h-[240px] lg:min-h-[320px]">
                <Image
                  src={match.image}
                  alt={match.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/40 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-[var(--landing-gold)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0B0F14]">
                  {match.tag}
                </span>
                <div className="absolute right-4 bottom-4 left-4">
                  <p className="font-display text-4xl font-bold text-white lg:text-5xl">
                    {match.score}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white/90">
                    {match.title}
                  </p>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
