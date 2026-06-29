import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description: "Learn how Kidza Arena connects players with sports venues.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PagePlaceholder
      title="About Kidza Arena"
      description="We make it easy to discover and book sports pitches. Full story coming soon."
    />
  );
}
