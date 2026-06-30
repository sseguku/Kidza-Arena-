import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/lib/constants/landing";
import {
  SectionHeader,
  SectionReveal,
  SectionShell,
} from "@/components/landing/section";

export function FaqSection() {
  return (
    <SectionShell id="faq" variant="muted">
      <SectionReveal>
        <SectionHeader
          eyebrow="FAQ"
          headline="Questions? We've got answers."
          description="Everything you need to know before stepping onto Kampala's finest pitch."
          brand="community"
        />
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <Accordion
          type="single"
          collapsible
          className="mx-auto mt-16 max-w-4xl lg:mt-24"
        >
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-border/80 py-2">
              <AccordionTrigger className="py-6 text-left font-display text-heading-md hover:no-underline lg:text-xl">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-body-lg text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionReveal>
    </SectionShell>
  );
}
