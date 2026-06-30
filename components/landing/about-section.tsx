import Image from "next/image";
import { StatCard } from "@/components/design-system";
import { aboutContent } from "@/lib/constants/landing";
import {
  SectionHeader,
  SectionReveal,
  SectionShell,
} from "@/components/landing/section";

export function AboutSection() {
  return (
    <SectionShell id="about" variant="muted">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-28">
        <SectionReveal>
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl sm:min-h-[400px] lg:min-h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80&auto=format&fit=crop"
              alt="Players on the Kidza Arena pitch in Kampala"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </SectionReveal>

        <div>
          <SectionReveal>
            <SectionHeader
              eyebrow={aboutContent.eyebrow}
              headline={aboutContent.headline}
              align="left"
              brand="adventure"
            />
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="mt-8 space-y-6 lg:mt-10">
              {aboutContent.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-body-lg text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="mt-12 grid grid-cols-2 gap-5 lg:mt-16 lg:gap-6">
              {aboutContent.stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  variant="elevated"
                />
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </SectionShell>
  );
}
