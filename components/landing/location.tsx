import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { GlassCard } from "@/components/landing/primitives/glass-card";
import { LandingButton } from "@/components/landing/primitives/button";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { brand, location } from "@/lib/constants/landing";

export function LocationSection() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.address)}`;

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
            <div
              className="absolute inset-0 bg-[#111820]"
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=85&auto=format&fit=crop")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-[#0B0F14]/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-panel-strong rounded-2xl p-6 text-center">
                <MapPin className="mx-auto size-10 text-gold" />
                <p className="mt-3 font-display text-xl font-bold text-white">
                  Kidza Arena
                </p>
                <p className="mt-1 text-[var(--landing-muted)]">Kampala, Uganda</p>
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
                      {brand.address}
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="size-6 shrink-0 text-gold" />
                  <div>
                    <p className="font-semibold text-white">Phone</p>
                    <a
                      href={`tel:${brand.phone.replace(/\s/g, "")}`}
                      className="mt-1 block text-lg text-[var(--landing-muted)] hover:text-white"
                    >
                      {brand.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="size-6 shrink-0 text-gold" />
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <a
                      href={`mailto:${brand.email}`}
                      className="mt-1 block text-lg text-[var(--landing-muted)] hover:text-white"
                    >
                      {brand.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Clock className="size-6 shrink-0 text-gold" />
                  <div>
                    <p className="font-semibold text-white">Hours</p>
                    <p className="mt-1 text-lg text-[var(--landing-muted)]">
                      {brand.hours}
                    </p>
                  </div>
                </li>
              </ul>
            </GlassCard>

            <LandingButton
              href={mapsUrl}
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
