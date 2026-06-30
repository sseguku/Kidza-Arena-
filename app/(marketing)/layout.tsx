import { LandingNavbar } from "@/components/landing";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="landing-theme relative flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
