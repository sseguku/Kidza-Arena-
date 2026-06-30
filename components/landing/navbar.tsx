"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { LandingButton } from "@/components/landing/primitives/button";
import { brand } from "@/lib/constants/landing";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Why Us", href: "#why" },
  { label: "Facilities", href: "#facilities" },
  { label: "Academy", href: "#academy" },
  { label: "Gallery", href: "#gallery" },
  { label: "Pricing", href: "#pricing" },
];

export function LandingNavbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const overlay = isHome && !scrolled;

  return (
    <header
      className={cn(
        "top-0 z-50 w-full transition-all duration-500",
        isHome ? "fixed" : "sticky",
        overlay
          ? "border-transparent bg-transparent"
          : "border-b border-white/10 bg-[#0B0F14]/90 shadow-lg backdrop-blur-xl",
      )}
    >
      <div className="landing-container flex h-20 items-center justify-between lg:h-24">
        <Link href="/" className="group flex items-center gap-3 lg:gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--landing-green)] text-base font-black text-white shadow-glow-green transition-transform duration-300 group-hover:scale-105 lg:size-14 lg:text-lg">
            KA
          </span>
          <span
            className={cn(
              "font-display text-xl font-bold tracking-tight lg:text-2xl",
              overlay ? "text-white" : "text-white",
            )}
          >
            {brand.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-10 lg:gap-12 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-lg font-medium transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full",
                overlay
                  ? "text-white/85 hover:text-white"
                  : "text-white/75 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <LandingButton href="/book" variant="gold" size="lg">
            Book Now
          </LandingButton>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <button
              type="button"
              aria-label="Open menu"
              className={cn(
                "flex size-12 items-center justify-center rounded-full border-2 transition-colors",
                overlay
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-white/20 text-white hover:bg-white/10",
              )}
            >
              <Menu className="size-6" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-white/10 bg-[#0B0F14] text-white"
          >
            <SheetHeader>
              <SheetTitle className="font-display text-2xl text-white">
                {brand.name}
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-10 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xl font-medium text-white/85 hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-10">
              <LandingButton href="/book" variant="gold" size="lg" className="w-full">
                Book Now
              </LandingButton>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
