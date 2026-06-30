import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { footerContent } from "@/lib/constants/landing";
import { footerNavGroups } from "@/lib/constants/navigation";
import { siteConfig } from "@/lib/metadata";
import { SectionReveal } from "@/components/landing/section";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="container-premium py-20 lg:py-28">
        <SectionReveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Link href="/" className="inline-flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-pitch text-lg font-bold text-pitch-foreground shadow-md">
                  KA
                </span>
                <span className="font-display text-2xl font-bold lg:text-3xl">
                  {siteConfig.name}
                </span>
              </Link>
              <p className="mt-6 max-w-lg text-body-lg text-background/75 lg:mt-8">
                Kampala&apos;s premier football venue. FIFA-standard turf,
                world-class facilities, and a community built for the love of
                the game.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row sm:items-end lg:justify-end">
              <div className="flex-1">
                <p className="text-eyebrow text-background/50">
                  Stay in the loop
                </p>
                <p className="mt-3 font-display text-heading-lg lg:text-xl">
                  Tournaments, offers & academy news
                </p>
              </div>
              <Button variant="pitch" size="xl" className="shrink-0" asChild>
                <Link href="/contact">Subscribe</Link>
              </Button>
            </div>
          </div>
        </SectionReveal>

        <Separator className="my-16 bg-background/15 lg:my-20" />

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <SectionReveal>
            <h3 className="font-display text-heading-md lg:text-xl">Visit Us</h3>
            <ul className="mt-6 space-y-4 text-body-md text-background/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {footerContent.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary" />
                <a
                  href={`tel:${footerContent.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-background"
                >
                  {footerContent.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary" />
                <a
                  href={`mailto:${footerContent.email}`}
                  className="transition-colors hover:text-background"
                >
                  {footerContent.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-primary" />
                {footerContent.hours}
              </li>
            </ul>
          </SectionReveal>

          {/* Nav groups */}
          {footerNavGroups.map((group, index) => (
            <SectionReveal key={group.title} delay={index * 0.05}>
              <h3 className="font-display text-heading-md lg:text-xl">{group.title}</h3>
              <ul className="mt-6 space-y-4">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-md text-background/75 transition-colors hover:text-background"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </SectionReveal>
          ))}

          {/* Quick links to landing sections */}
          <SectionReveal delay={0.15}>
            <h3 className="font-display text-heading-md lg:text-xl">Explore</h3>
            <ul className="mt-6 space-y-4">
              {[
                { title: "Facilities", href: "#facilities" },
                { title: "Academy", href: "#academy" },
                { title: "Tournaments", href: "#tournaments" },
                { title: "Pricing", href: "#pricing" },
                { title: "FAQ", href: "#faq" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-body-md text-background/75 transition-colors hover:text-background"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </SectionReveal>
        </div>

        <Separator className="my-16 bg-background/15 lg:my-20" />

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-body-md text-background/55">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerContent.social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-md text-background/55 transition-colors hover:text-background"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
