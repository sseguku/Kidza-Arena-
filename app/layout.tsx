import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { defaultMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
