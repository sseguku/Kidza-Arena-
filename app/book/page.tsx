import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Book a Pitch",
  description: "Reserve your football pitch or sports facility in minutes.",
  path: "/book",
});

export default function BookPage() {
  return (
    <PagePlaceholder
      title="Book a Pitch"
      description="Select a pitch, choose your slot, and confirm your booking. Coming soon."
    />
  );
}
