import { contact } from "@/lib/constants/contact";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  contact: typeof contact;
  links: {
    twitter?: string;
    github?: string;
  };
};

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
};

export type FooterLinkGroup = {
  title: string;
  links: NavItem[];
};
