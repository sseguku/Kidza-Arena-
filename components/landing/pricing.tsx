import { Check } from "lucide-react";
import { GlassCard } from "@/components/landing/primitives/glass-card";
import { LandingButton } from "@/components/landing/primitives/button";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { pricingPlans } from "@/lib/constants/landing";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <SectionShell id="pricing">
      <Reveal>
        <SectionHeader
          eyebrow="Pricing"
          headline="Transparent. Affordable. Premium."
          description="Quality football for every budget — from casual kickabouts to corporate events."
        />
      </Reveal>

      <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-3 lg:gap-10">
        {pricingPlans.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 0.1}>
            <GlassCard
              strong={plan.highlighted}
              hover
              className={cn(
                "relative flex h-full flex-col",
                plan.highlighted &&
                  "ring-2 ring-[var(--landing-gold)] shadow-glow-gold lg:scale-[1.04]",
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--landing-gold)] px-5 py-1.5 text-sm font-bold text-[#0B0F14]">
                  Most Popular
                </span>
              )}
              <h3 className="text-landing-card">{plan.name}</h3>
              <p className="mt-2 text-[var(--landing-muted)]">{plan.description}</p>
              <div className="mt-8">
                <span className="font-display text-4xl font-bold text-white lg:text-5xl">
                  {plan.price}
                </span>
                <span className="ml-2 text-lg text-[var(--landing-muted)]">
                  / {plan.period}
                </span>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-1 size-5 shrink-0 text-[var(--landing-green-light)]" />
                    <span className="text-lg text-white/85">{feature}</span>
                  </li>
                ))}
              </ul>
              <LandingButton
                href="/contact"
                variant={plan.highlighted ? "gold" : "outline"}
                size="lg"
                className="mt-10 w-full"
              >
                Get in Touch
              </LandingButton>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
