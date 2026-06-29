import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Get in touch with the Kidza Arena team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PagePlaceholder
      title="Contact Us"
      description="Have questions or feedback? Our contact form is coming soon."
    />
  );
}
