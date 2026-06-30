import { Icon } from "@/components/design-system";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { facilities } from "@/lib/constants/landing";
import {
  SectionHeader,
  SectionReveal,
  SectionShell,
} from "@/components/landing/section";

export function FacilitiesSection() {
  return (
    <SectionShell id="facilities">
      <SectionReveal>
        <SectionHeader
          eyebrow="World-Class Facilities"
          headline="Everything a champion needs, in one place"
          description="From the first touch on premium turf to the post-match shower — every detail is designed for players who take the game seriously."
          brand="pitch"
        />
      </SectionReveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:mt-24 lg:grid-cols-3 lg:gap-10">
        {facilities.map((facility, index) => (
          <SectionReveal key={facility.id} delay={index * 0.05}>
            <Card variant="interactive" className="h-full">
              <CardHeader className="gap-5">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 lg:size-16">
                  <Icon name={facility.icon} tone="pitch" size="lg" />
                </div>
                <CardTitle>{facility.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body-md text-muted-foreground">
                  {facility.description}
                </p>
              </CardContent>
            </Card>
          </SectionReveal>
        ))}
      </div>
    </SectionShell>
  );
}
