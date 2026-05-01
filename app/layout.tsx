import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Consultation Booking Form",
  description: "Please fill in your details to book your session.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
