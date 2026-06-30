import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionHeader, SectionShell } from "@/components/landing/primitives/section";
import { faqItems } from "@/lib/constants/landing";

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
        <Accordion
          type="single"
          collapsible
          className="mx-auto mt-16 max-w-3xl lg:mt-24"
        >
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-white/10 py-2"
            >
              <AccordionTrigger className="py-6 text-left font-display text-xl font-semibold text-white hover:no-underline lg:text-2xl">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-lg leading-relaxed text-[var(--landing-muted)]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </SectionShell>
  );
}
