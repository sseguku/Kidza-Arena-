import type { NavItem } from "@/types";

/** Primary site navigation — anchor sections on the homepage, works from any route. */
export const mainNavItems: NavItem[] = [
  { title: "Why Us", href: "/#why" },
  { title: "Facilities", href: "/#facilities" },
  { title: "Academy", href: "/#academy" },
  { title: "Gallery", href: "/#gallery" },
  { title: "Pricing", href: "/#pricing" },
  { title: "Availability", href: "/availability" },
];

export const footerNavGroups = [
  {
    title: "Explore",
    links: [
      { title: "Why Kidza Arena", href: "/#why" },
      { title: "Facilities", href: "/#facilities" },
      { title: "Academy", href: "/#academy" },
      { title: "Gallery", href: "/#gallery" },
      { title: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Book",
    links: [
      { title: "Book a Pitch", href: "/book" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
    ],
  },
];
