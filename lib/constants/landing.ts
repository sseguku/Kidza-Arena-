/** Static landing page content — no business logic */

export const heroContent = {
  eyebrow: "Kampala's Premier Football Destination",
  headline: "This is the best football venue in Kampala.",
  subheadline:
    "FIFA-standard turf, floodlit nights, and a community built for players who demand more from every match.",
  primaryCta: "Explore the Arena",
  secondaryCta: "View Facilities",
  videoSrc:
    "https://videos.pexels.com/video-files/3997749/3997749-sd_960_540_30fps.mp4",
  posterSrc:
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=80&auto=format&fit=crop",
};

export const facilities = [
  {
    id: "pitch",
    title: "FIFA-Quality Turf",
    description:
      "Professional-grade artificial grass with optimal shock absorption — the same standard top academies trust.",
    icon: "pitch" as const,
  },
  {
    id: "floodlights",
    title: "Pro Floodlights",
    description:
      "Train and play under stadium-level illumination. Book evening slots without compromising visibility.",
    icon: "zap" as const,
  },
  {
    id: "changing",
    title: "Premium Changing Rooms",
    description:
      "Spacious lockers, hot showers, and match-day amenities that make every visit feel professional.",
    icon: "shield" as const,
  },
  {
    id: "café",
    title: "Players' Lounge & Café",
    description:
      "Pre-match coffee, post-game recovery drinks, and a social space for teams and supporters.",
    icon: "community" as const,
  },
  {
    id: "parking",
    title: "Secure Parking",
    description:
      "Ample on-site parking with 24/7 security — arrive focused, leave without the hassle.",
    icon: "location" as const,
  },
  {
    id: "medical",
    title: "First-Aid & Recovery",
    description:
      "On-site first-aid station and stretching zones to keep your squad match-ready all season.",
    icon: "heart" as const,
  },
];

export const aboutContent = {
  eyebrow: "About Kidza Arena",
  headline: "More than a pitch. It's where Kampala plays.",
  paragraphs: [
    "Born from a love of the beautiful game, Kidza Arena was built for players who refuse to settle for ordinary pitches. We set out to create Uganda's most complete football experience — from the first whistle to the final celebration.",
    "Whether you're a weekend warrior, a rising academy star, or a corporate league chasing glory, you'll find a home here. Our standards match your ambition.",
  ],
  stats: [
    { label: "Matches Hosted", value: "2,400+" },
    { label: "Active Players", value: "8,500+" },
    { label: "Academy Graduates", value: "320+" },
    { label: "Years of Excellence", value: "6" },
  ],
};

export const galleryImages = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80&auto=format&fit=crop",
    alt: "Aerial view of football pitch at golden hour",
    span: "col-span-2 row-span-2",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80&auto=format&fit=crop",
    alt: "Players celebrating a goal",
    span: "col-span-1 row-span-1",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80&auto=format&fit=crop",
    alt: "Night match under floodlights",
    span: "col-span-1 row-span-1",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80&auto=format&fit=crop",
    alt: "Close-up of football on premium turf",
    span: "col-span-1 row-span-1",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80&auto=format&fit=crop",
    alt: "Team huddle before kickoff",
    span: "col-span-1 row-span-1",
  },
];

export const academyContent = {
  eyebrow: "Kidza Academy",
  headline: "Where tomorrow's stars learn today",
  description:
    "Structured coaching programmes for ages 6–18, led by UEFA-licensed coaches. Technical drills, tactical awareness, and the mindset of champions.",
  highlights: [
    "Weekly age-group sessions",
    "Holiday intensive camps",
    "Pathway to regional tournaments",
    "Individual player assessments",
  ],
  image:
    "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=900&q=80&auto=format&fit=crop",
};

export const tournamentContent = {
  eyebrow: "Tournaments & Leagues",
  headline: "Compete at the highest level in Kampala",
  description:
    "From corporate cups to youth championships, Kidza Arena hosts Kampala's most anticipated football events throughout the year.",
  events: [
    {
      id: "1",
      name: "Kampala Corporate Cup",
      date: "Quarterly",
      teams: "16 teams",
    },
    {
      id: "2",
      name: "Kidza Youth Championship",
      date: "Aug – Sep",
      teams: "24 teams",
    },
    {
      id: "3",
      name: "Friday Night League",
      date: "Every Friday",
      teams: "8 teams",
    },
  ],
  image:
    "https://images.unsplash.com/photo-1489944440615-453ea207c165?w=900&q=80&auto=format&fit=crop",
};

export const testimonials = [
  {
    id: "1",
    quote:
      "I've played across East Africa — Kidza Arena is on another level. The pitch, the atmosphere, the organisation. This is what Kampala football needed.",
    author: "James Okello",
    role: "Captain, Kampala United FC",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "Our academy parents travel from across the city because nowhere else matches the coaching quality and facilities. Worth every shilling.",
    author: "Sarah Nambi",
    role: "Parent, Kidza Academy",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "We host our corporate league here every month. Professional setup, zero hassle, and our team actually looks forward to match day.",
    author: "David Muwonge",
    role: "HR Director, TechCorp Uganda",
    rating: 5,
  },
];

export const pricingPlans = [
  {
    id: "casual",
    name: "Casual Play",
    price: "UGX 150,000",
    period: "per hour",
    description: "Perfect for friendly matches and small groups.",
    features: [
      "Full pitch access",
      "Bibs & balls included",
      "Changing room access",
      "Floodlights (evening)",
    ],
    variant: "default" as const,
    highlighted: false,
  },
  {
    id: "team",
    name: "Team Package",
    price: "UGX 520,000",
    period: "per month",
    description: "Weekly slot for committed squads and leagues.",
    features: [
      "4 sessions per month",
      "Priority booking",
      "Dedicated storage locker",
      "10% café discount",
      "Match referee option",
    ],
    variant: "pitch" as const,
    highlighted: true,
  },
  {
    id: "academy",
    name: "Academy Pass",
    price: "UGX 280,000",
    period: "per month",
    description: "Structured training for developing players.",
    features: [
      "2 coached sessions weekly",
      "Skills assessment",
      "Tournament entry priority",
      "Parent progress reports",
    ],
    variant: "community" as const,
    highlighted: false,
  },
];

export const faqItems = [
  {
    id: "location",
    question: "Where is Kidza Arena located?",
    answer:
      "We're in the heart of Kampala, easily accessible from Kololo, Nakawa, and the city centre. Exact directions are shared upon booking confirmation.",
  },
  {
    id: "booking",
    question: "How do I book a pitch?",
    answer:
      "Online booking is launching soon. For now, contact our team via phone or email to reserve your slot. Walk-ins are welcome subject to availability.",
  },
  {
    id: "capacity",
    question: "What pitch formats are available?",
    answer:
      "We offer full 11-a-side, 7-a-side, and 5-a-side configurations on our FIFA-standard turf. Let us know your format when booking.",
  },
  {
    id: "equipment",
    question: "Is equipment provided?",
    answer:
      "Match balls, bibs, and cones are included with every booking. Boots with moulded studs or astro trainers are recommended for our turf.",
  },
  {
    id: "academy",
    question: "How do I enrol in the academy?",
    answer:
      "Academy trials run every term. Register your interest through our contact page and our coaching team will arrange an assessment session.",
  },
  {
    id: "parking",
    question: "Is parking available?",
    answer:
      "Yes — free secure parking for players and spectators. Arrive 15 minutes early on tournament days for the best spots.",
  },
];

export const ctaContent = {
  headline: "Ready to play on Kampala's finest pitch?",
  subheadline:
    "Join thousands of players who've made Kidza Arena their home ground.",
  primaryCta: "Get Started",
  secondaryCta: "Contact Us",
};

export const footerContent = {
  address: "Plot 14, Lugogo Bypass, Kampala, Uganda",
  phone: "+256 700 123 456",
  email: "hello@kidzaarena.ug",
  hours: "Mon – Sun: 6:00 AM – 11:00 PM",
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Twitter", href: "https://twitter.com" },
    { label: "Facebook", href: "https://facebook.com" },
  ],
};
