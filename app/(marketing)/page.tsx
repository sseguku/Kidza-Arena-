import type { Metadata } from "next";
import {
  AboutSection,
  AcademyPreviewSection,
  CtaSection,
  FacilitiesSection,
  FaqSection,
  GalleryPreviewSection,
  HeroSection,
  LandingFooter,
  PricingPreviewSection,
  TestimonialsSection,
  TournamentPreviewSection,
} from "@/components/landing";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Kidza Arena — Kampala's Premier Football Venue",
  description:
    "FIFA-standard turf, floodlit nights, academy training, and tournaments. The best football venue in Kampala.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FacilitiesSection />
      <AboutSection />
      <GalleryPreviewSection />
      <AcademyPreviewSection />
      <TournamentPreviewSection />
      <TestimonialsSection />
      <PricingPreviewSection />
      <CtaSection />
      <FaqSection />
      <LandingFooter />
    </>
  );
}
