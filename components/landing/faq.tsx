import { ChevronDown } from "lucide-react";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { faqItems } from "@/lib/constants/landing";
import { cn } from "@/lib/utils";

export function FaqSection() {
  return (
    <SectionShell id="faq" variant="elevated">
      <Reveal>
        <SectionHeader
          eyebrow="FAQ"
          headline="Got questions?"
          description="Everything you need to know before stepping onto Kampala's finest pitch."
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-16 max-w-3xl lg:mt-24">
          {faqItems.map((item) => (
            <details
              key={item.id}
              className="group border-b border-white/10 py-2 last:border-b-0"
            >
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-start justify-between gap-4 py-6 text-left font-display text-xl font-semibold text-white outline-none transition-colors lg:text-2xl",
                  "[&::-webkit-details-marker]:hidden",
                  "focus-visible:ring-2 focus-visible:ring-[var(--landing-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e141c]",
                )}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className="mt-1 size-5 shrink-0 text-white/50 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-6 text-lg leading-relaxed text-[var(--landing-muted)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}
