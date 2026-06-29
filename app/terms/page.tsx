import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Terms and conditions for using Kidza Arena.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PagePlaceholder
      title="Terms of Service"
      description="Our terms of service will be published here."
    />
  );
}
