"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/lib/constants/landing";
import {
  SectionHeader,
  SectionReveal,
  SectionShell,
} from "@/components/landing/section";

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="size-5 fill-value text-value-foreground"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <SectionShell id="testimonials" variant="muted">
      <SectionReveal>
        <SectionHeader
          eyebrow="What Players Say"
          headline="Trusted by Kampala's football community"
          description="From league captains to academy parents — hear why Kidza Arena is the venue everyone recommends."
          brand="value"
        />
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <div className="mt-16 -mx-5 flex gap-6 overflow-x-auto px-5 pb-6 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-24 lg:grid-cols-3 lg:gap-10">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              variant="elevated"
              className="min-w-[88vw] shrink-0 snap-center sm:min-w-0"
            >
              <CardContent className="px-8 py-10 lg:px-10 lg:py-12">
                <StarRating count={testimonial.rating} />
                <blockquote className="mt-6 text-body-lg leading-relaxed lg:text-xl lg:leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <footer className="mt-8 border-t border-border pt-6">
                  <cite className="not-italic">
                    <p className="font-display text-heading-md">
                      {testimonial.author}
                    </p>
                    <p className="mt-1 text-body-md text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </cite>
                </footer>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionReveal>
    </SectionShell>
  );
}
