import {
  Bricolage_Grotesque,
  Plus_Jakarta_Sans,
  Geist_Mono,
} from "next/font/google";

/** Display — bold, adventurous headlines (Competitive + Fun) */
export const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/** Body — friendly, readable UI text (Community + Affordable) */
export const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const fontVariables = `${displayFont.variable} ${bodyFont.variable} ${geistMono.variable}`;
