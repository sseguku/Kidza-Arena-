import type { Metadata } from "next";
import {
  AcademySection,
  AvailabilityPreviewSection,
  BookingCtaSection,
  FacilitiesSection,
  FaqSection,
  GallerySection,
  HeroSection,
  LandingFooter,
  LocationSection,
  MatchHighlightsSection,
  PitchExperienceSection,
  PricingSection,
  TestimonialsSection,
  TournamentsSection,
  TrustedBySection,
  WhyKidzaSection,
} from "@/components/landing";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Kidza Arena — Kampala's Premier Football Venue",
  description:
    "More Than a Pitch. It's an Adventure. Premium turf, academy, tournaments & events. The best football venue in Kampala.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustedBySection />
      <WhyKidzaSection />
      <FacilitiesSection />
      <PitchExperienceSection />
      <MatchHighlightsSection />
      <GallerySection />
      <AcademySection />
      <TournamentsSection />
      <TestimonialsSection />
      <PricingSection />
      <AvailabilityPreviewSection />
      <BookingCtaSection />
      <FaqSection />
      <LocationSection />
      <LandingFooter />
    </>
  );
}
