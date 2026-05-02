import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://astroanikita.in"),
  title: "Astro Anikita — Vedic Astrology & Numerology Consultations",
  description:
    "Trusted Vedic astrology and numerology consultations with Anikita. Personal readings rooted in classical Jyotish — guiding you through career, relationships, and life's most pressing questions.",
  keywords: [
    "astrology",
    "numerology",
    "Vedic astrology",
    "kundli",
    "online consultation",
    "Astro Anikita",
  ],
  openGraph: {
    title: "Astro Anikita — Vedic Astrology & Numerology Consultations",
    description:
      "Personal Vedic astrology and numerology consultations rooted in classical tradition.",
    url: "https://astroanikita.in",
    siteName: "Astro Anikita",
    images: [{ url: "/anikita.jpg", width: 1200, height: 1500, alt: "Anikita" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astro Anikita — Vedic Astrology & Numerology Consultations",
    description:
      "Personal Vedic astrology and numerology consultations rooted in classical tradition.",
    images: ["/anikita.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased relative">
        <div className="sunfield" />
        <div className="orb animate-pulseSoft" style={{ width: 480, height: 480, background: "#FFE89B", top: -160, left: -120 }} />
        <div className="orb animate-pulseSoft" style={{ width: 420, height: 420, background: "#F5B700", bottom: -120, right: -120 }} />
        {children}
      </body>
    </html>
  );
}
