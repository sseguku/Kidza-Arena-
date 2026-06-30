import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { galleryImages } from "@/lib/constants/landing";
import {
  SectionHeader,
  SectionReveal,
  SectionShell,
} from "@/components/landing/section";

export function GalleryPreviewSection() {
  return (
    <SectionShell id="gallery">
      <SectionReveal>
        <SectionHeader
          eyebrow="Gallery"
          headline="See the arena in action"
          description="Match nights, academy sessions, and tournament finals — this is what football in Kampala looks like at its best."
          brand="fun"
        />
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <div className="mt-16 grid auto-rows-[220px] grid-cols-2 gap-4 sm:auto-rows-[260px] sm:gap-6 lg:mt-24 lg:auto-rows-[340px] lg:gap-8 xl:auto-rows-[420px]">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-2xl lg:rounded-3xl ${image.span}`}
            >
              <Image
                src={image.src.replace("w=800", "w=1200").replace("w=600", "w=900")}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </div>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal delay={0.15}>
        <div className="mt-12 flex justify-center lg:mt-16">
          <Button variant="ghost" size="lg" asChild>
            <Link href="#gallery">
              View full gallery
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      </SectionReveal>
    </SectionShell>
  );
}
