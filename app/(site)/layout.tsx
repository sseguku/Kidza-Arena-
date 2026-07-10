import { LandingNavbar } from "@/components/landing";
import { Footer } from "@/components/layout/footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="landing-theme relative flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
