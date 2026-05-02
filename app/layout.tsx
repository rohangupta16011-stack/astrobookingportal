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
        <div className="sunfield" />
        <div className="orb animate-pulseSoft" style={{ width: 480, height: 480, background: "#FFE89B", top: -160, left: -120 }} />
        <div className="orb animate-pulseSoft" style={{ width: 420, height: 420, background: "#F5B700", bottom: -120, right: -120 }} />
        {children}
      </body>
    </html>
  );
}
