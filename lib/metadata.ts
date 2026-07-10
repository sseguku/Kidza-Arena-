import type { Metadata } from "next";
import type { SiteConfig } from "@/types";
import { contact } from "@/lib/constants/contact";

export const siteConfig: SiteConfig = {
  name: "Kidza Arena",
  description:
    "Book football pitches and sports facilities near you. Find, compare, and reserve the perfect pitch for your next match.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og-image.png",
  contact,
  links: {},
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "football pitch booking",
    "sports facility rental",
    "pitch hire",
    "5-a-side",
    "Kidza Arena",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export function createPageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  return {
    title,
    description: description ?? siteConfig.description,
    alternates: {
      canonical: `${siteConfig.url}${path}`,
    },
    openGraph: {
      title,
      description: description ?? siteConfig.description,
      url: `${siteConfig.url}${path}`,
    },
  };
}
