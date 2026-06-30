"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import {
  Reveal,
  SectionHeader,
  SectionShell,
} from "@/components/landing/primitives/section";
import {
  galleryCategories,
  galleryImages,
  type GalleryCategory,
} from "@/lib/constants/landing";
import { cn } from "@/lib/utils";

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const lightboxImage =
    lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      <SectionShell id="gallery">
        <Reveal>
          <SectionHeader
            eyebrow="Gallery"
            headline="Moments that define match day"
            description="Matches, academy sessions, events, and the pitch in all its glory."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap justify-center gap-3 lg:mt-16">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-6 py-2.5 text-base font-semibold transition-all duration-300",
                  activeCategory === cat
                    ? "bg-[var(--landing-gold)] text-[#0B0F14] shadow-glow-gold"
                    : "glass-panel text-white/80 hover:text-white",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[260px] sm:gap-6 lg:mt-16 lg:auto-rows-[320px] lg:grid-cols-3 lg:gap-8 xl:auto-rows-[380px]">
            {filtered.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setLightboxIndex(index)}
                className={cn(
                  "group relative overflow-hidden rounded-3xl text-left focus-visible:ring-2 focus-visible:ring-[var(--landing-gold)] focus-visible:outline-none",
                  image.span,
                )}
                aria-label={`View ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#0B0F14]/0 transition-colors duration-300 group-hover:bg-[#0B0F14]/40" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex size-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <ZoomIn className="size-6 text-white" />
                  </span>
                </div>
                <span className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {image.category}
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      </SectionShell>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F14]/95 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="size-6" />
          </button>
          <div className="relative h-[70vh] w-full max-w-5xl overflow-hidden rounded-3xl">
            <Image
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          <p className="absolute bottom-8 left-1/2 max-w-lg -translate-x-1/2 text-center text-lg text-white/80">
            {lightboxImage.alt}
          </p>
        </div>
      )}
    </>
  );
}
