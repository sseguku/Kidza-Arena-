import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Home",
  description:
    "Find and book football pitches and sports facilities with Kidza Arena.",
  path: "/",
});

export default function HomePage() {
  return (
    <PagePlaceholder
      title="Welcome to Kidza Arena"
      description="Your platform for booking football pitches and sports facilities. Full experience coming soon."
    />
  );
}
