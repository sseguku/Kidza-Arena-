import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Sign In",
  description: "Sign in to your Kidza Arena account.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <PagePlaceholder
      title="Sign In"
      description="Authentication will be available here soon."
    />
  );
}
