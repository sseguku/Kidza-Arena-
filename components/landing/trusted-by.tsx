import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { trustedBy } from "@/lib/constants/landing";

export function TrustedBySection() {
  return (
    <SectionShell id="trusted" variant="elevated">
      <Reveal>
        <SectionHeader
          eyebrow={trustedBy.eyebrow}
          headline={trustedBy.headline}
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4 lg:mt-20 lg:gap-6">
          {trustedBy.partners.map((partner) => (
            <span
              key={partner}
              className="glass-panel rounded-full px-6 py-3 text-base font-semibold text-white/85 transition-colors duration-300 hover:border-gold/30 hover:text-white lg:px-8 lg:py-4 lg:text-lg"
            >
              {partner}
            </span>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}
