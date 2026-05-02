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
  title: "Astro Anikita — Consultation Booking",
  description: "Book your astrology or numerology consultation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased relative">
        <div className="starfield" />
        <div className="orb" style={{ width: 500, height: 500, background: "#5B2A99", top: -120, left: -120 }} />
        <div className="orb" style={{ width: 420, height: 420, background: "#D4AF37", bottom: -100, right: -120 }} />
        {children}
      </body>
    </html>
  );
}
