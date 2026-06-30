"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNavItems } from "@/lib/constants/navigation";
import { siteConfig } from "@/lib/metadata";
import { cn } from "@/lib/utils";

function NavLinks({
  onNavigate,
  overlay,
}: {
  onNavigate?: () => void;
  overlay?: boolean;
}) {
  const pathname = usePathname();

  return (
    <>
      {mainNavItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "text-nav transition-colors duration-200",
              overlay
                ? cn(
                    "text-white/85 hover:text-white",
                    isActive && "text-white",
                  )
                : cn(
                    "hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground",
                  ),
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const overlay = isHome && !scrolled;

  return (
    <header
      className={cn(
        "top-0 z-50 w-full transition-all duration-300",
        isHome ? "fixed" : "sticky",
        overlay
          ? "border-transparent bg-transparent"
          : "border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-lg",
      )}
    >
      <div className="container-premium flex h-20 items-center justify-between lg:h-24">
        <Link href="/" className="flex items-center gap-3 lg:gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-pitch text-base font-bold text-pitch-foreground shadow-md lg:size-14 lg:rounded-2xl lg:text-lg">
            KA
          </span>
          <span
            className={cn(
              "font-display text-xl font-bold tracking-tight lg:text-2xl",
              overlay && "text-white",
            )}
          >
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-10 lg:gap-14 md:flex">
          <NavLinks overlay={overlay} />
        </nav>

        <div className="hidden items-center gap-4 md:flex lg:gap-5">
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "rounded-full text-lg",
              overlay && "text-white hover:bg-white/10 hover:text-white",
            )}
            asChild
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button variant="pitch" size="lg" asChild>
            <Link href="/book">Book a pitch</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="outline"
              size="icon-lg"
              aria-label="Open menu"
              className={cn(
                overlay &&
                  "border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white",
              )}
            >
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm px-6">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">
                {siteConfig.name}
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-10 flex flex-col gap-6">
              <NavLinks />
            </nav>
            <div className="mt-10 flex flex-col gap-4">
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button variant="pitch" size="lg" asChild>
                <Link href="/book">Book a pitch</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
