import { siteConfig } from "@/lib/metadata";

/** schema.org LocalBusiness JSON-LD for Kidza Arena */
export function getLocalBusinessJsonLd() {
  const { contact, name, url, description } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name,
    description,
    url,
    telephone: contact.phoneRaw,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Alongside Lugujja - Busega Main Road, after Community Center",
      addressLocality: "Kampala",
      addressCountry: "UG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 0.298,
      longitude: 32.475,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [],
  };
}
