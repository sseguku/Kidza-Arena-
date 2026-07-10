import Link from "next/link";
import { Navigation } from "lucide-react";
import { ContactDetails } from "@/components/shared/contact-details";
import { MapEmbed } from "@/components/shared/map-embed";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { contact } from "@/lib/constants/contact";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description: `Contact Kidza Arena — ${contact.phone}, ${contact.email}. ${contact.address}`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-display-sm">Contact Us</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">
          Questions, bookings, or events — reach the Kidza Arena team directly.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Get in touch</CardTitle>
            <CardDescription>
              Call, email, or WhatsApp us to book a pitch or ask about academy
              and events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactDetails />
          </CardContent>
        </Card>

        <Card variant="default">
          <CardHeader>
            <CardTitle>Visit the arena</CardTitle>
            <CardDescription>{contact.address}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-muted">
              <MapEmbed className="min-h-[280px]" />
            </div>
            <Button asChild className="w-full" size="lg">
              <Link
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="size-4" />
                Get Directions
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
