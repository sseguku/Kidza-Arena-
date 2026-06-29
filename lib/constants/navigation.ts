import type { NavItem } from "@/types";

export const mainNavItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Pitches", href: "/pitches" },
  { title: "Book", href: "/book" },
  { title: "About", href: "/about" },
];

export const footerNavGroups = [
  {
    title: "Platform",
    links: [
      { title: "Find Pitches", href: "/pitches" },
      { title: "Book a Pitch", href: "/book" },
      { title: "How It Works", href: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About Us", href: "/about" },
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
