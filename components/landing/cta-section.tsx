import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ctaContent } from "@/lib/constants/landing";
import { SectionReveal, SectionShell } from "@/components/landing/section";

export function CtaSection() {
  return (
    <SectionShell variant="dark">
      <SectionReveal>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-section-title text-balance text-background">
            {ctaContent.headline}
          </h2>
          <p className="mt-6 text-subtitle text-background/80 lg:mt-8">
            {ctaContent.subheadline}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:mt-12 lg:gap-5">
            <Button variant="pitch" size="xl" className="w-full sm:w-auto" asChild>
              <Link href="/contact">{ctaContent.primaryCta}</Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="w-full border-2 border-background/30 bg-transparent text-background hover:scale-[1.02] hover:bg-background/10 hover:text-background sm:w-auto"
              asChild
            >
              <Link href="/contact">{ctaContent.secondaryCta}</Link>
            </Button>
          </div>
        </div>
      </SectionReveal>
    </SectionShell>
  );
}
