import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Pitches",
  description: "Browse available football pitches and sports facilities.",
  path: "/pitches",
});

export default function PitchesPage() {
  return (
    <PagePlaceholder
      title="Find Pitches"
      description="Browse and compare football pitches near you. Coming soon."
    />
  );
}
