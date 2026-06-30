"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { heroContent } from "@/lib/constants/landing";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const heroTextClass = "text-hero text-white";
const heroSubClass =
  "mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl lg:mt-8 lg:text-2xl lg:leading-relaxed";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const textVariants = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 28 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { delay: 0.2 + i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
        }),
      };

  const ctaBlock = (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center lg:mt-12 lg:gap-5">
      <Button variant="pitch" size="xl" className="w-full sm:w-auto" asChild>
        <Link href="#facilities">{heroContent.primaryCta}</Link>
      </Button>
      <Button
        variant="outline"
        size="xl"
        className="w-full border-2 border-white/40 bg-white/10 text-white backdrop-blur-md hover:scale-[1.02] hover:border-white/60 hover:bg-white/20 hover:text-white sm:w-auto"
        asChild
      >
        <Link href="#about">{heroContent.secondaryCta}</Link>
      </Button>
    </div>
  );

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-[95dvh] items-end overflow-hidden"
    >
      <Image
        src={heroContent.posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />

      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={heroContent.posterSrc}
        className="absolute inset-0 size-full object-cover"
        aria-hidden="true"
      >
        <source src={heroContent.videoSrc} type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 container-premium w-full pb-24 pt-36 sm:pb-28 lg:pb-36 lg:pt-44">
        <div className="max-w-5xl">
          {textVariants ? (
            <>
              <motion.p
                custom={0}
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-eyebrow text-value"
              >
                {heroContent.eyebrow}
              </motion.p>
              <motion.h1
                custom={1}
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className={cn("mt-5 lg:mt-6", heroTextClass)}
              >
                {heroContent.headline}
              </motion.h1>
              <motion.p
                custom={2}
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className={heroSubClass}
              >
                {heroContent.subheadline}
              </motion.p>
              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={textVariants}
              >
                {ctaBlock}
              </motion.div>
            </>
          ) : (
            <>
              <p className="text-eyebrow text-value">{heroContent.eyebrow}</p>
              <h1 className={cn("mt-5 lg:mt-6", heroTextClass)}>
                {heroContent.headline}
              </h1>
              <p className={heroSubClass}>{heroContent.subheadline}</p>
              {ctaBlock}
            </>
          )}
        </div>
      </div>

      <a
        href="#facilities"
        className={cn(
          "absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-white lg:bottom-12",
          !prefersReducedMotion && "animate-kidza-pulse-soft",
        )}
        aria-label="Scroll to facilities"
      >
        <ChevronDown className="size-8" strokeWidth={1.5} />
      </a>
    </section>
  );
}
