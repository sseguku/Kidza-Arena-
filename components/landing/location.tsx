import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { GlassCard } from "@/components/landing/primitives/glass-card";
import { LandingButton } from "@/components/landing/primitives/button";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { MapEmbed } from "@/components/shared/map-embed";
import { location } from "@/lib/constants/landing";
import { contact } from "@/lib/constants/contact";

export function LocationSection() {
  return (
    <SectionShell id="location">
      <Reveal>
        <SectionHeader
          eyebrow={location.eyebrow}
          headline={location.headline}
          description={location.description}
        />
      </Reveal>

      <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-2 lg:gap-12">
        <Reveal direction="left">
          <GlassCard strong className="relative min-h-[320px] overflow-hidden p-0 lg:min-h-[480px]">
            <MapEmbed className="absolute inset-0 min-h-[320px] lg:min-h-[480px]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0F14]/90 via-[#0B0F14]/40 to-transparent p-6">
              <div className="flex items-center gap-3">
                <MapPin className="size-6 shrink-0 text-gold" />
                <div>
                  <p className="font-display text-lg font-bold text-white">
                    {contact.mapsPlaceName}
                  </p>
                  <p className="text-sm text-[var(--landing-muted)]">
                    Kampala, Uganda
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          <div className="flex h-full flex-col justify-center gap-6">
            <GlassCard>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin className="mt-1 size-6 shrink-0 text-gold" />
                  <div>
                    <p className="font-semibold text-white">Address</p>
                    <p className="mt-1 text-lg text-[var(--landing-muted)]">
                      {contact.address}
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="size-6 shrink-0 text-gold" />
                  <div>
                    <p className="font-semibold text-white">Phone</p>
                    <a
                      href={contact.phoneTel}
                      className="mt-1 block text-lg text-[var(--landing-muted)] hover:text-white"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="size-6 shrink-0 text-gold" />
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <a
                      href={contact.emailMailto}
                      className="mt-1 block text-lg text-[var(--landing-muted)] hover:text-white"
                    >
                      {contact.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Clock className="size-6 shrink-0 text-gold" />
                  <div>
                    <p className="font-semibold text-white">Hours</p>
                    <p className="mt-1 text-lg text-[var(--landing-muted)]">
                      {contact.hours}
                    </p>
                  </div>
                </li>
              </ul>
            </GlassCard>

            <LandingButton
              href={contact.mapsUrl}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="size-5" />
              {location.directions}
            </LandingButton>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
