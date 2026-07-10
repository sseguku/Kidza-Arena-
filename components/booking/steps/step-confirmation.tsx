"use client";

import { LandingButton } from "@/components/landing/primitives/button";
import { contact } from "@/lib/constants/contact";
import { motion } from "framer-motion";
import { CheckCircle2, Home, MessageCircle, Phone } from "lucide-react";

export function StepConfirmation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-xl space-y-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.15,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="mx-auto flex size-24 items-center justify-center rounded-full bg-[var(--landing-green)]/20"
      >
        <CheckCircle2 className="size-14 text-[var(--landing-green)]" strokeWidth={1.5} />
      </motion.div>

      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Thank you for booking Kidza Arena!
        </h2>
        <p className="text-base leading-relaxed text-white/65 sm:text-lg">
          Your request has been submitted successfully. An administrator will
          contact you shortly to confirm your booking and provide payment
          instructions.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 text-left sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--landing-gold)]">
          What happens next?
        </p>
        <ol className="mt-4 space-y-3 text-sm text-white/70">
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--landing-green)] text-xs font-bold text-white">
              1
            </span>
            We review your booking request
          </li>
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--landing-green)] text-xs font-bold text-white">
              2
            </span>
            You receive confirmation via your preferred contact method
          </li>
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--landing-green)] text-xs font-bold text-white">
              3
            </span>
            Complete payment to secure your slot
          </li>
        </ol>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <LandingButton href={contact.phoneTel} variant="primary" size="lg">
          <Phone className="size-5" />
          Call {contact.phone}
        </LandingButton>
        <LandingButton href={contact.whatsappUrl} variant="whatsapp" size="lg">
          <MessageCircle className="size-5" />
          WhatsApp Us
        </LandingButton>
      </div>

      <LandingButton href="/" variant="outline" size="lg" className="mx-auto inline-flex">
        <Home className="size-5" />
        Back to Home
      </LandingButton>
    </motion.div>
  );
}
