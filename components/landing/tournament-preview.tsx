import Image from "next/image";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tournamentContent } from "@/lib/constants/landing";
import {
  SectionHeader,
  SectionReveal,
  SectionShell,
} from "@/components/landing/section";

export function TournamentPreviewSection() {
  return (
    <SectionShell id="tournaments">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-28">
        <SectionReveal>
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl shadow-2xl sm:min-h-[400px] lg:min-h-[560px]">
            <Image
              src={tournamentContent.image.replace("w=900", "w=1200")}
              alt="Tournament final at Kidza Arena"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent" />
          </div>
        </SectionReveal>

        <div>
          <SectionReveal>
            <SectionHeader
              eyebrow={tournamentContent.eyebrow}
              headline={tournamentContent.headline}
              description={tournamentContent.description}
              align="left"
              brand="adventure"
            />
          </SectionReveal>

          <div className="mt-10 space-y-5 lg:mt-12">
            {tournamentContent.events.map((event, index) => (
              <SectionReveal key={event.id} delay={index * 0.05}>
                <Card variant="elevated" className="gap-4 py-6">
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-6 text-body-md text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="size-5 text-adventure" />
                      {event.date}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Users className="size-5 text-community" />
                      {event.teams}
                    </span>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.2}>
            <Button
              variant="adventure"
              size="xl"
              className="mt-10 w-full sm:w-auto lg:mt-12"
              asChild
            >
              <Link href="/contact">Register your team</Link>
            </Button>
          </SectionReveal>
        </div>
      </div>
    </SectionShell>
  );
}
