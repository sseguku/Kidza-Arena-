import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { academyContent } from "@/lib/constants/landing";
import {
  SectionHeader,
  SectionReveal,
  SectionShell,
} from "@/components/landing/section";

export function AcademyPreviewSection() {
  return (
    <SectionShell id="academy" variant="gradient">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-28">
        <div className="order-2 lg:order-1">
          <SectionReveal>
            <SectionHeader
              eyebrow={academyContent.eyebrow}
              headline={academyContent.headline}
              description={academyContent.description}
              align="left"
              brand="community"
            />
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <ul className="mt-10 space-y-5 lg:mt-12">
              {academyContent.highlights.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-community/15">
                    <Check className="size-4 text-community" strokeWidth={2.5} />
                  </span>
                  <span className="text-body-lg">{item}</span>
                </li>
              ))}
            </ul>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center lg:mt-12">
              <Button variant="community" size="xl" className="w-full sm:w-auto" asChild>
                <Link href="/contact">Enrol your child</Link>
              </Button>
              <Badge variant="community" className="px-4 py-1.5 text-sm">
                Ages 6 – 18
              </Badge>
            </div>
          </SectionReveal>
        </div>

        <SectionReveal className="order-1 lg:order-2">
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl shadow-2xl sm:min-h-[400px] lg:min-h-[560px]">
            <Image
              src={academyContent.image.replace("w=900", "w=1200")}
              alt="Young players training at Kidza Academy"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8">
              <Badge variant="value" className="px-4 py-1.5 text-sm">
                UEFA-Licensed Coaches
              </Badge>
            </div>
          </div>
        </SectionReveal>
      </div>
    </SectionShell>
  );
}
