import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Book a Pitch",
  description:
    "Reserve your football pitch at Kidza Arena. Book individual play or reserve the entire pitch for your team.",
  path: "/book",
});

export default function BookLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
