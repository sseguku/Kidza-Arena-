import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { defaultMetadata } from "@/lib/metadata";
import { getLocalBusinessJsonLd } from "@/lib/schema/local-business";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = getLocalBusinessJsonLd();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} min-h-screen antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
