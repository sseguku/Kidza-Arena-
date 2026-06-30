import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { LandingButton } from "@/components/landing/primitives/button";
import { Reveal, SectionShell } from "@/components/landing/primitives/section";
import { bookingCta, brand } from "@/lib/constants/landing";

export function BookingCtaSection() {
  const whatsappUrl = `https://wa.me/${brand.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Kidza Arena, I'd like to book a pitch.")}`;
  const telUrl = `tel:${brand.phone.replace(/\s/g, "")}`;

  return (
    <SectionShell id="book" className="!py-0">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]">
          <div className="absolute inset-0">
            <Image
              src={bookingCta.backgroundImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              loading="lazy"
              aria-hidden
            />
            <div className="absolute inset-0 bg-[#0B0F14]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14]/90 via-[#0B0F14]/70 to-[var(--landing-green)]/20" />
          </div>

          <div className="relative z-10 px-6 py-24 text-center sm:px-12 sm:py-28 lg:px-20 lg:py-36">
            <h2 className="text-landing-section text-white">
              {bookingCta.headline}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-landing-body text-white/75 lg:mt-8">
              {bookingCta.subheadline}
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row lg:mt-16">
              <LandingButton href="/book" variant="gold" size="xl">
                {bookingCta.primaryCta}
              </LandingButton>
            </div>

            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row lg:mt-16 lg:gap-10">
              <a
                href={telUrl}
                className="glass-panel-strong inline-flex items-center gap-3 rounded-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:border-gold/30"
              >
                <Phone className="size-5 text-gold" />
                {brand.phone}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.03] hover:brightness-110"
              >
                <MessageCircle className="size-5" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
