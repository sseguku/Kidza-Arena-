import Link from "next/link";
import { Reveal } from "@/components/landing/primitives/section";
import { LandingButton } from "@/components/landing/primitives/button";
import { brand, footerLinks } from "@/lib/constants/landing";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#080b10]">
      <div className="landing-container py-20 lg:py-28">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Link href="/" className="inline-flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-[var(--landing-green)] text-lg font-black text-white shadow-glow-green">
                  KA
                </span>
                <div>
                  <span className="font-display text-2xl font-bold text-white lg:text-3xl">
                    {brand.name}
                  </span>
                  <p className="mt-1 text-sm text-gold">{brand.tagline}</p>
                </div>
              </Link>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-[var(--landing-muted)]">
                Kampala&apos;s premier football arena. Premium turf, academy
                training, tournaments, and unforgettable match-day experiences.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-6 lg:items-end">
              <p className="text-landing-eyebrow text-gold">Ready to play?</p>
              <LandingButton href="/book" variant="gold" size="xl">
                Book Now
              </LandingButton>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 border-t border-white/10 pt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          <Reveal delay={0.05}>
            <h3 className="font-display text-xl font-bold text-white">Explore</h3>
            <ul className="mt-6 space-y-4">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-lg text-[var(--landing-muted)] transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="font-display text-xl font-bold text-white">Company</h3>
            <ul className="mt-6 space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-lg text-[var(--landing-muted)] transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <h3 className="font-display text-xl font-bold text-white">Contact</h3>
            <ul className="mt-6 space-y-4 text-lg text-[var(--landing-muted)]">
              <li>{brand.address}</li>
              <li>
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {brand.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${brand.email}`} className="hover:text-white">
                  {brand.email}
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-10 sm:flex-row">
          <p className="text-base text-[var(--landing-muted)]">
            &copy; {year} {brand.name}. All rights reserved.
          </p>
          <p className="text-base text-[var(--landing-muted)]">
            Built for players, teams, and communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
