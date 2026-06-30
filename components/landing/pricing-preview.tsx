import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingPlans } from "@/lib/constants/landing";
import { cn } from "@/lib/utils";
import {
  SectionHeader,
  SectionReveal,
  SectionShell,
} from "@/components/landing/section";

export function PricingPreviewSection() {
  return (
    <SectionShell id="pricing">
      <SectionReveal>
        <SectionHeader
          eyebrow="Affordable Excellence"
          headline="Transparent pricing, no surprises"
          description="Quality football shouldn't break the bank. Choose the plan that fits your game — from casual kickabouts to competitive leagues."
          brand="value"
        />
      </SectionReveal>

      <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-3 lg:gap-10">
        {pricingPlans.map((plan, index) => (
          <SectionReveal key={plan.id} delay={index * 0.08}>
            <Card
              variant={plan.highlighted ? "pitch" : "elevated"}
              className={cn(
                "relative h-full gap-0 py-0",
                plan.highlighted &&
                  "ring-2 ring-primary shadow-2xl lg:scale-[1.03]",
              )}
            >
              {plan.highlighted && (
                <Badge
                  variant="adventure"
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 text-sm"
                >
                  Most Popular
                </Badge>
              )}
              <CardHeader className="gap-3 pt-10 pb-6 lg:pt-12">
                <CardTitle className="text-heading-lg">{plan.name}</CardTitle>
                <CardDescription className="text-body-md">
                  {plan.description}
                </CardDescription>
                <div className="mt-6">
                  <span className="font-display text-display-md">{plan.price}</span>
                  <span className="ml-2 text-body-md text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-8">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" strokeWidth={2.5} />
                      <span className="text-body-md">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pb-10 lg:pb-12">
                <Button
                  variant={plan.highlighted ? "pitch" : "outline"}
                  className="w-full"
                  size="xl"
                  asChild
                >
                  <Link href="/contact">Get in touch</Link>
                </Button>
              </CardFooter>
            </Card>
          </SectionReveal>
        ))}
      </div>
    </SectionShell>
  );
}
