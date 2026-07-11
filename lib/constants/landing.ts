/**
 * Kidza Arena landing page content — static data only, no business logic.
 * @module lib/constants/landing
 */

import { contact } from "./contact";

export const brand = {
  name: "Kidza Arena",
  tagline: "More Than a Pitch. It's an Adventure.",
  ...contact,
} as const;

export const hero = {
  eyebrow: "Kampala's Premier Football Arena",
  headline: "The best football venue in Kampala.",
  subheadline:
    "Premium turf. Floodlit nights. Academy training. Tournaments. Where friends, families, schools, and communities come to play, compete, and create memories.",
  primaryCta: "Book Now",
  secondaryCta: "View Gallery",
  videoSrc:
    "https://videos.pexels.com/video-files/3997749/3997749-sd_960_540_30fps.mp4",
  posterSrc:
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=85&auto=format&fit=crop",
  stats: [
    { id: "hours", value: "24/7", label: "Open" },
    { id: "matches", value: 5000, suffix: "+", label: "Matches Played" },
    { id: "players", value: 1000, suffix: "+", label: "Happy Players" },
    { id: "turf", value: "Premium", label: "Artificial Turf" },
  ],
  badges: ["FIFA-Standard Turf", "FUFA Coaches", "Secure Venue"],
} as const;

export const trustedBy = {
  eyebrow: "Trusted by the Community",
  headline: "Where Kampala comes to play",
  partners: [
    "Schools & Universities",
    "Corporate Teams",
    "Youth Academies",
    "Community Leagues",
    "Birthday Parties",
    "Team Building",
  ],
} as const;

export const whyKidza = {
  eyebrow: "Why Kidza Arena",
  headline: "More than a pitch. It's an adventure.",
  description:
    "Kidza Arena is affordable, community-driven, competitive, and fun — built for everyone who loves the beautiful game.",
  pillars: [
    {
      id: "affordable",
      title: "Affordable",
      description:
        "World-class football without world-class prices. Transparent rates for casual players and committed teams.",
      accent: "gold" as const,
    },
    {
      id: "community",
      title: "Community",
      description:
        "A home for schools, companies, families, and neighbourhoods. Football that brings people together.",
      accent: "green" as const,
    },
    {
      id: "competitive",
      title: "Competitive",
      description:
        "Tournaments, leagues, and academy pathways for players who want to test themselves at the highest level.",
      accent: "green" as const,
    },
    {
      id: "fun",
      title: "Fun",
      description:
        "Friendly matches, birthday parties, corporate events — every visit feels like match day.",
      accent: "gold" as const,
    },
  ],
} as const;

export const facilities = [
  {
    id: "floodlights",
    title: "Pro Floodlights",
    description: "Play under stadium-quality illumination. Evening slots without compromise.",
    icon: "zap" as const,
  },
  {
    id: "parking",
    title: "Secure Parking",
    description: "Ample on-site parking with 24/7 security for players and guests.",
    icon: "location" as const,
  },
  {
    id: "changing",
    title: "Changing Rooms",
    description: "Spacious lockers, hot showers, and match-day amenities.",
    icon: "shield" as const,
  },
  {
    id: "washrooms",
    title: "Washrooms",
    description: "Clean, well-maintained facilities for players and spectators.",
    icon: "heart" as const,
  },
  {
    id: "refreshments",
    title: "Refreshments",
    description: "Pre-match fuel and post-game recovery at the players' lounge.",
    icon: "community" as const,
  },
  {
    id: "security",
    title: "Security",
    description: "Professional security team on site around the clock.",
    icon: "shield" as const,
  },
  {
    id: "access",
    title: "24-Hour Access",
    description: "Book early morning training or late-night matches — we're always open.",
    icon: "zap" as const,
  },
  {
    id: "academy",
    title: "Football Academy",
    description: "UEFA-licensed coaching for ages 6–18 on the same premium pitch.",
    icon: "pitch" as const,
  },
];

export const pitchExperience = {
  eyebrow: "Pitch Experience",
  headline: "Your game. Your format.",
  description:
    "From quick 5-a-side battles to full 7-a-side showdowns — configure the pitch for how you play.",
  formats: [
    {
      id: "5aside",
      title: "5-a-Side",
      description: "Fast, technical, high-intensity. Perfect for after-work kickabouts.",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=85&auto=format&fit=crop",
    },
    {
      id: "6aside",
      title: "6-a-Side",
      description: "Balanced squads, more space to build play. Ideal for league matches.",
      image: "/images/pitch-experience/6-aside.png",
    },
    {
      id: "7aside",
      title: "7-a-Side",
      description: "Full tactical battles on premium turf. Tournament-ready dimensions.",
      image: "/images/pitch-experience/7-aside.png",
    },
  ],
} as const;

export const matchHighlights = {
  eyebrow: "Live Match Highlights",
  headline: "Feel the energy of match night",
  matches: [
    {
      id: "1",
      title: "Friday Night League Final",
      score: "3 – 2",
      tag: "League",
      image: "/images/match-highlights/feel_energy_1.png",
    },
    {
      id: "2",
      title: "Corporate Cup Semi-Final",
      score: "1 – 1",
      tag: "Tournament",
      image: "/images/match-highlights/feel_energy_2.png",
    },
    {
      id: "3",
      title: "Academy Showcase",
      score: "4 – 0",
      tag: "Academy",
      image: "/images/match-highlights/feel_energy_3.png",
    },
  ],
} as const;

export const galleryCategories = [
  "All",
  "Matches",
  "Academy",
  "Events",
  "Facilities",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export const galleryImages = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&q=85&auto=format&fit=crop",
    alt: "Aerial view of football pitch at golden hour",
    category: "Facilities" as const,
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    id: "2",
    src: "/images/gallery/matches/match_1.png",
    alt: "Match action on the Kidza Arena pitch",
    category: "Matches" as const,
    span: "",
  },
  {
    id: "3",
    src: "/images/gallery/matches/match_2.png",
    alt: "Players in action during a match at Kidza Arena",
    category: "Matches" as const,
    span: "",
  },
  {
    id: "7",
    src: "/images/gallery/matches/match_3.png",
    alt: "Competitive football match at Kidza Arena",
    category: "Matches" as const,
    span: "",
  },
  {
    id: "8",
    src: "/images/gallery/matches/match_4.png",
    alt: "Match day atmosphere at Kidza Arena",
    category: "Matches" as const,
    span: "",
  },
  {
    id: "4",
    src: "/images/gallery/academy/academy_1.png",
    alt: "Academy training session on the Kidza Arena pitch",
    category: "Academy" as const,
    span: "",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900&q=85&auto=format&fit=crop",
    alt: "Team huddle before kickoff",
    category: "Events" as const,
    span: "",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900&q=85&auto=format&fit=crop",
    alt: "Close-up of football on premium turf",
    category: "Facilities" as const,
    span: "lg:col-span-2",
  },
];

export const academy = {
  eyebrow: "Football Academy",
  headline: "Train where champions are made",
  description:
    "Structured programmes for ages 6–18, led by UEFA-licensed coaches. Technical mastery, tactical intelligence, and the mindset to compete.",
  schedule: [
    { day: "Mon & Wed", time: "4:00 – 6:00 PM", group: "Ages 6–10" },
    { day: "Tue & Thu", time: "4:00 – 6:00 PM", group: "Ages 11–14" },
    { day: "Sat", time: "9:00 AM – 12:00 PM", group: "Ages 15–18" },
  ],
  image:
    "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1400&q=85&auto=format&fit=crop",
  cta: "Join the Academy",
} as const;

export const tournaments = {
  eyebrow: "Tournaments",
  headline: "Compete at Kampala's finest arena",
  description:
    "Corporate cups, youth championships, and Friday night leagues — Kidza Arena hosts the events everyone talks about.",
  events: [
    {
      id: "1",
      name: "Kampala Corporate Cup",
      date: "Quarterly",
      teams: "16 Teams",
      prize: "UGX 5M",
    },
    {
      id: "2",
      name: "Kidza Youth Championship",
      date: "Aug – Sep",
      teams: "24 Teams",
      prize: "Trophies + Medals",
    },
    {
      id: "3",
      name: "Friday Night League",
      date: "Every Friday",
      teams: "8 Teams",
      prize: "Monthly Champions",
    },
  ],
  image:
    "https://images.unsplash.com/photo-1489944440615-453ea207c165?w=1400&q=85&auto=format&fit=crop",
} as const;

export const testimonials = [
  {
    id: "1",
    quote:
      "I've played across East Africa — nothing in Kampala compares to Kidza Arena. The pitch, the vibe, the organisation. This is it.",
    author: "James Okello",
    role: "Captain, Kampala United FC",
    rating: 5,
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=85&auto=format&fit=crop&crop=face",
  },
  {
    id: "2",
    quote:
      "Our academy parents travel from across the city. The coaching quality and facilities are worth every shilling.",
    author: "Sarah Nambi",
    role: "Parent, Kidza Academy",
    rating: 5,
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=85&auto=format&fit=crop&crop=face",
  },
  {
    id: "3",
    quote:
      "We host our corporate league here every month. Professional setup, zero hassle, and the team lives for match day.",
    author: "David Muwonge",
    role: "HR Director, TechCorp Uganda",
    rating: 5,
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=85&auto=format&fit=crop&crop=face",
  },
  {
    id: "4",
    quote:
      "Booked for my son's birthday — best party ever. The staff handled everything. Already planning the next one.",
    author: "Grace Akello",
    role: "Parent & Event Host",
    rating: 5,
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=85&auto=format&fit=crop&crop=face",
  },
];

export const pricingPlans = [
  {
    id: "individual",
    name: "Individual Play",
    price: "UGX 10,000",
    period: "per person per play",
    description:
      "Perfect for individuals who want to join a game or play casually.",
    features: [
      "Join open games & casual sessions",
      "No full team required",
      "Bibs & balls included",
      "Flexible play times",
    ],
    highlighted: false,
    priceEmphasis: true,
  },
  {
    id: "team",
    name: "Team Package",
    price: "UGX 80,000",
    period: "per hour (Team Booking)",
    description:
      "Ideal for teams booking the entire pitch for training, friendly matches, or competitions.",
    features: [
      "Exclusive full-pitch access",
      "Bibs & balls included",
      "Changing rooms & showers",
      "Floodlights for evening slots",
      "Referee option available",
    ],
    highlighted: true,
    priceEmphasis: true,
  },
  {
    id: "events",
    name: "Events & Parties",
    price: "Custom",
    period: "quote",
    description: "Birthdays, corporate, team building.",
    features: [
      "Dedicated event coordinator",
      "Custom pitch setup",
      "Refreshments package",
      "Photography area",
    ],
    highlighted: false,
    priceEmphasis: false,
  },
];

export const bookingCta = {
  headline: "Ready to play on Kampala's finest pitch?",
  subheadline: "Book your slot in minutes. Walk-ins welcome subject to availability.",
  primaryCta: "Book Now",
  backgroundImage:
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=85&auto=format&fit=crop",
} as const;

export const faqItems = [
  {
    id: "booking",
    question: "How do I book a pitch?",
    answer:
      "Online booking launches soon. Call or WhatsApp us to reserve your slot. Walk-ins welcome subject to availability.",
  },
  {
    id: "formats",
    question: "What pitch formats are available?",
    answer:
      "5-a-side, 6-a-side, and 7-a-side on FIFA-standard artificial turf. Tell us your format when booking.",
  },
  {
    id: "equipment",
    question: "Is equipment provided?",
    answer:
      "Match balls, bibs, and cones included. Astro trainers or moulded studs recommended.",
  },
  {
    id: "academy",
    question: "How do I join the academy?",
    answer:
      "Trials run every term. Contact us to register interest and schedule an assessment session.",
  },
  {
    id: "events",
    question: "Can I host a birthday or corporate event?",
    answer:
      "Yes — we offer full event packages including pitch hire, refreshments, and coordination.",
  },
  {
    id: "parking",
    question: "Is parking available?",
    answer: "Free secure parking on site. Arrive 15 minutes early on tournament days.",
  },
];

export const location = {
  eyebrow: "Find Us",
  headline: "In the heart of Kampala",
  description:
    "Find us alongside Lugujja - Busega Main Road, after Community Center. Easy access from Busega, Natete, and central Kampala.",
  mapsUrl: contact.mapsUrl,
  directions: "Get Directions",
} as const;

export const footerLinks = {
  explore: [
    { label: "Facilities", href: "#facilities" },
    { label: "Academy", href: "#academy" },
    { label: "Tournaments", href: "#tournaments" },
    { label: "Gallery", href: "#gallery" },
    { label: "Pricing", href: "#pricing" },
  ],
  company: [
    { label: "About", href: "#why" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "#faq" },
    { label: "Location", href: "#location" },
  ],
} as const;
