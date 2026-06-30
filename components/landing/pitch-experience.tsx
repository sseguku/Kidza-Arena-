import Image from "next/image";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { pitchExperience } from "@/lib/constants/landing";

export function PitchExperienceSection() {
  return (
    <SectionShell id="experience">
      <Reveal>
        <SectionHeader
          eyebrow={pitchExperience.eyebrow}
          headline={pitchExperience.headline}
          description={pitchExperience.description}
        />
      </Reveal>

      <div className="mt-16 space-y-8 lg:mt-24 lg:space-y-12">
        {pitchExperience.formats.map((format, i) => (
          <Reveal key={format.id} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
            <article
              className={`group grid items-center gap-8 overflow-hidden rounded-3xl lg:grid-cols-2 lg:gap-12 ${
                i % 2 === 1 ? "lg:[direction:rtl]" : ""
              }`}
            >
              <div className="relative min-h-[280px] overflow-hidden rounded-3xl lg:min-h-[420px] lg:[direction:ltr]">
                <Image
                  src={format.image}
                  alt={format.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14]/60 to-transparent" />
              </div>
              <div className="lg:[direction:ltr] lg:px-4">
                <span className="text-landing-eyebrow text-gold">{format.title}</span>
                <h3 className="mt-4 text-landing-section">{format.title}</h3>
                <p className="mt-6 text-landing-body text-[var(--landing-muted)]">
                  {format.description}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
