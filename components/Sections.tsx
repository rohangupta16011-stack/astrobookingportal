"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const PHONE_DIGITS = "919877419210";
const PHONE_DISPLAY = "+91 98774 19210";
const EMAIL = "astroanikita@gmail.com";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all ${
        scrolled
          ? "bg-canvas/85 backdrop-blur-lg border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-sun-grad flex items-center justify-center text-ink font-serif text-lg shadow-soft">
            ✦
          </span>
          <span className="font-serif text-lg sm:text-xl text-ink">
            Astro <span className="text-sunDeep">Anikita</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-inkSoft hover:text-ink transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-sun-grad scale-x-0 group-hover:scale-x-100 transition-transform" />
            </a>
          ))}
          <a href="#book" className="btn-sun !py-2.5 !px-5 text-sm">
            Book a Session
          </a>
        </div>

        <button
          aria-label="Open menu"
          className="md:hidden w-10 h-10 rounded-lg border border-border flex items-center justify-center text-ink"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-canvas/95 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-inkSoft hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="btn-sun !py-3 text-center"
            >
              Book a Session
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="pt-28 sm:pt-36 pb-12 sm:pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sun/40 bg-cream/60 backdrop-blur-sm mb-6 shadow-soft">
            <span className="text-sunDeep text-sm">✦</span>
            <span className="text-xs tracking-[0.2em] uppercase text-inkSoft font-medium">
              Trusted Vedic Astrologer & Numerologist
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink leading-[1.1] mb-5">
            Find clarity through the wisdom of{" "}
            <span className="text-sun-grad italic">stars and numbers</span>
          </h1>
          <p className="text-inkSoft text-base sm:text-lg max-w-lg leading-relaxed mb-8">
            Personal astrology and numerology consultations rooted in classical Vedic
            tradition — guiding you through career, relationships, and life's most
            pressing questions.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#book" className="btn-sun">
              Book a Consultation
            </a>
            <a href="#services" className="btn-ghost">
              Explore Services
            </a>
          </div>

          <div className="flex items-center gap-6 mt-10 pt-8 border-t border-border">
            <Stat n="5+" label="Years experience" />
            <div className="w-px h-10 bg-border" />
            <Stat n="500+" label="Consultations" />
            <div className="w-px h-10 bg-border" />
            <Stat n="100%" label="Confidential" />
          </div>
        </div>

        <div className="order-1 md:order-2 relative">
          <div className="relative aspect-[4/5] max-w-md mx-auto">
            <div className="absolute -inset-4 bg-sun-grad rounded-[40px] opacity-20 blur-2xl" />
            <div className="relative w-full h-full rounded-[32px] overflow-hidden border-4 border-surface shadow-card">
              <Image
                src="/anikita.jpg"
                alt="Anikita — Vedic Astrologer & Numerologist"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 sm:-right-8 bg-surface rounded-2xl shadow-card border border-border p-4 flex items-center gap-3 max-w-[220px]">
              <div className="w-10 h-10 rounded-full bg-sun-grad flex items-center justify-center text-ink shrink-0 font-serif">
                ✦
              </div>
              <div>
                <p className="text-xs text-muted">Trained under</p>
                <p className="text-sm text-ink font-medium leading-tight">
                  Astro Arun Pandit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-2xl sm:text-3xl text-sun-grad">{n}</p>
      <p className="text-xs text-muted mt-0.5">{label}</p>
    </div>
  );
}

export function Services() {
  const items = [
    {
      title: "Astrology",
      icon: "♈︎",
      desc:
        "A detailed Vedic chart reading covering career, relationships, health, and life timing — interpreted through classical Jyotish principles.",
      bullets: [
        "Birth chart (Kundli) analysis",
        "Planetary periods (Dasha) timing",
        "Career, marriage, finance guidance",
        "Personalized remedies",
      ],
    },
    {
      title: "Numerology",
      icon: "✦",
      desc:
        "Decode the patterns hidden in your name and birth date to understand your strengths, life path, and the energies shaping your decisions.",
      bullets: [
        "Life path & destiny number",
        "Name compatibility analysis",
        "Lucky numbers, dates, colours",
        "Name-correction suggestions",
      ],
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Our Services"
          title="Two paths to clarity"
          subtitle="Whether you're at a crossroads or simply curious, choose the framework that resonates — or experience both."
        />

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {items.map((it) => (
            <article
              key={it.title}
              className="card p-7 sm:p-9 transition-transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-sun-grad flex items-center justify-center text-ink text-2xl mb-5 shadow-soft">
                {it.icon}
              </div>
              <h3 className="font-serif text-2xl text-ink mb-3">{it.title}</h3>
              <p className="text-inkSoft mb-5 leading-relaxed">{it.desc}</p>
              <ul className="space-y-2 mb-6">
                {it.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-inkSoft">
                    <span className="text-sunDeep mt-0.5">✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <a href="#book" className="text-sunDeep hover:underline text-sm font-medium">
                Book a session →
              </a>
            </article>
          ))}
        </div>

        <div className="card mt-6 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm tracking-widest uppercase text-inkSoft mb-1">Pricing</p>
            <p className="font-serif text-2xl text-ink">
              30 min · <span className="text-sun-grad">₹ 1,600</span>
              <span className="text-muted mx-3">/</span>
              60 min · <span className="text-sun-grad">₹ 3,200</span>
            </p>
          </div>
          <a href="#book" className="btn-sun whitespace-nowrap">Book Now</a>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent via-cream/30 to-transparent">
      <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-10 md:gap-14 items-center">
        <div className="md:col-span-2 relative">
          <div className="relative aspect-square max-w-sm mx-auto">
            <div className="absolute inset-0 bg-sun-grad rounded-[28px] rotate-3 opacity-25 blur-xl" />
            <div className="relative w-full h-full rounded-[28px] overflow-hidden border-4 border-surface shadow-card">
              <Image
                src="/anikita.jpg"
                alt="Anikita"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <SectionHeading
            eyebrow="About Anikita"
            title="A grounded voice in a noisy space"
            align="left"
          />
          <div className="space-y-4 text-inkSoft leading-relaxed mt-5">
            <p>
              Anikita is a Vedic astrologer and numerologist with over five years of
              dedicated practice — trained under the renowned <span className="text-ink font-medium">Astro Arun Pandit</span>.
              Her readings blend the depth of classical Jyotish with the everyday clarity
              of numerology.
            </p>
            <p>
              Across 500+ consultations, she has helped people navigate career
              decisions, relationships, financial questions, and the quieter
              crossroads of life. Her approach is grounded, judgment-free, and
              focused on what's actually useful to you.
            </p>
            <p>
              No theatrics. No vague predictions. Just careful chart work,
              honest interpretation, and remedies you can actually live with.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8">
            <Highlight label="Years experience" value="5+" />
            <Highlight label="Consultations" value="500+" />
            <Highlight label="Trained by" value="Astro Arun Pandit" small />
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlight({ value, label, small }: { value: string; label: string; small?: boolean }) {
  return (
    <div className="card p-4 text-center">
      <p
        className={`text-sun-grad font-serif ${
          small ? "text-base leading-tight" : "text-2xl"
        }`}
      >
        {value}
      </p>
      <p className="text-[11px] text-muted mt-1 leading-tight">{label}</p>
    </div>
  );
}

export function Process() {
  const steps = [
    {
      n: "01",
      title: "Book your slot",
      desc: "Pick astrology or numerology, choose your duration, and select a date and time that works for you.",
    },
    {
      n: "02",
      title: "Make payment",
      desc: "Pay securely via UPI by scanning the QR code, then upload your payment confirmation screenshot.",
    },
    {
      n: "03",
      title: "Get confirmation",
      desc: "We verify your payment and confirm your slot on WhatsApp within a few hours.",
    },
    {
      n: "04",
      title: "Your session",
      desc: "Meet Anikita on Google Meet at your scheduled time — sessions are held in Hindi or English, your choice.",
    },
  ];

  return (
    <section id="process" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Consultation Process"
          title="Simple, structured, and on your time"
          subtitle="From booking to your session — here's exactly how it works."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {steps.map((s, i) => (
            <div key={s.n} className="card p-6 relative">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-serif text-3xl text-sun-grad">{s.n}</span>
                {i < steps.length - 1 && (
                  <span className="hidden lg:block flex-1 h-px bg-border" />
                )}
              </div>
              <h3 className="font-serif text-xl text-ink mb-2">{s.title}</h3>
              <p className="text-sm text-inkSoft leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BookSection({ children }: { children: React.ReactNode }) {
  return (
    <section
      id="book"
      className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-cream/40 via-canvas to-cream/40"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Book a Session"
          title="Reserve your consultation"
          subtitle="Share a few details and pick your time. Your information stays private."
        />
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "What details do I need to share for a reading?",
    a: "Your full name, exact date and time of birth, place of birth, and the area of life you'd like guidance on. The more accurate your birth time, the more precise the reading.",
  },
  {
    q: "How is the consultation conducted?",
    a: "Online via Google Meet at your scheduled time. You'll receive the meeting link on WhatsApp once your slot is confirmed.",
  },
  {
    q: "In which language are sessions held?",
    a: "Hindi or English — your preference. Just let us know on WhatsApp when confirming your slot.",
  },
  {
    q: "What is your refund or reschedule policy?",
    a: "Refunds are available only if the booking is cancelled at least 1 hour before the consultation time. Reschedules are accommodated when possible.",
  },
  {
    q: "Will I receive a recording of the session?",
    a: "No, recordings are not provided. We recommend taking notes during your session and asking any follow-up questions live.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
        />
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`card overflow-hidden transition-all ${isOpen ? "shadow-card" : ""}`}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 text-left p-5 sm:p-6"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-medium text-ink text-base sm:text-lg">{f.q}</span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full bg-sun-grad flex items-center justify-center text-ink transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1 text-inkSoft text-sm sm:text-base leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream/40 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-sun-grad flex items-center justify-center text-ink font-serif">✦</span>
            <span className="font-serif text-xl text-ink">
              Astro <span className="text-sunDeep">Anikita</span>
            </span>
          </div>
          <p className="text-sm text-inkSoft leading-relaxed">
            Trusted Vedic astrology and numerology consultations — guiding you through life's questions with clarity and care.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-widest uppercase text-muted mb-4">Quick Links</p>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-inkSoft hover:text-ink">{l.label}</a>
              </li>
            ))}
            <li>
              <a href="#book" className="text-inkSoft hover:text-ink">Book a session</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-widest uppercase text-muted mb-4">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`mailto:${EMAIL}`} className="text-inkSoft hover:text-ink flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {EMAIL}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${PHONE_DIGITS}`} target="_blank" rel="noreferrer" className="text-inkSoft hover:text-ink flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.88 11.9L4 20l4.22-1.11a7.93 7.93 0 0 0 3.83.97h.01c4.37 0 7.93-3.55 7.94-7.92a7.88 7.88 0 0 0-2.4-5.62zm-5.55 12.2h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.58 6.58 0 0 1-1.01-3.5c0-3.64 2.96-6.6 6.61-6.6 1.76 0 3.42.69 4.66 1.94a6.55 6.55 0 0 1 1.93 4.67c0 3.64-2.96 6.59-6.6 6.59zm3.62-4.94c-.2-.1-1.17-.58-1.36-.64-.18-.07-.31-.1-.45.1-.13.2-.51.64-.63.78-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.59-.53-.99-1.18-1.11-1.38-.11-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34l-.38-.01c-.13 0-.35.05-.53.25-.18.2-.7.69-.7 1.67 0 .99.72 1.94.82 2.07.1.13 1.42 2.16 3.43 3.03.48.21.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.12-.94-.05-.08-.18-.13-.38-.23z" />
                </svg>
                {PHONE_DISPLAY}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Astro Anikita. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Crafted with care · Sessions kept confidential
          </p>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFAB() {
  const waMessage = "Hi Anikita, I'd like to know more about a consultation.";
  const waHref = `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(waMessage)}`;
  const callHref = `tel:+${PHONE_DIGITS}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <a
        href={callHref}
        aria-label={`Call ${PHONE_DISPLAY}`}
        className="group flex items-center"
      >
        <span className="hidden sm:flex items-center gap-2 mr-3 px-4 py-2 rounded-full bg-surface border border-border shadow-card text-sm text-ink opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
          <span className="font-medium">Call us</span>
          <span className="text-muted">{PHONE_DISPLAY}</span>
        </span>
        <span className="relative flex">
          <span className="relative w-14 h-14 rounded-full bg-sun-grad shadow-glowStrong flex items-center justify-center text-ink group-hover:scale-110 transition-transform">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
        </span>
      </a>

      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center"
      >
        <span className="hidden sm:flex items-center gap-2 mr-3 px-4 py-2 rounded-full bg-surface border border-border shadow-card text-sm text-ink opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
          <span className="font-medium">Chat with us</span>
          <span className="text-muted">on WhatsApp</span>
        </span>
        <span className="relative flex">
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-wa-ping" />
          <span className="relative w-16 h-16 rounded-full bg-[#25D366] shadow-glowStrong flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.88 11.9L4 20l4.22-1.11a7.93 7.93 0 0 0 3.83.97h.01c4.37 0 7.93-3.55 7.94-7.92a7.88 7.88 0 0 0-2.4-5.62zm-5.55 12.2h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.58 6.58 0 0 1-1.01-3.5c0-3.64 2.96-6.6 6.61-6.6 1.76 0 3.42.69 4.66 1.94a6.55 6.55 0 0 1 1.93 4.67c0 3.64-2.96 6.59-6.6 6.59zm3.62-4.94c-.2-.1-1.17-.58-1.36-.64-.18-.07-.31-.1-.45.1-.13.2-.51.64-.63.78-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.59-.53-.99-1.18-1.11-1.38-.11-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34l-.38-.01c-.13 0-.35.05-.53.25-.18.2-.7.69-.7 1.67 0 .99.72 1.94.82 2.07.1.13 1.42 2.16 3.43 3.03.48.21.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.12-.94-.05-.08-.18-.13-.38-.23z" />
            </svg>
          </span>
          <span
            aria-hidden
            className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#FF3B30] text-white text-[12px] font-bold flex items-center justify-center border-2 border-canvas shadow-soft"
          >
            1
          </span>
        </span>
      </a>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const a = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${a}`}>
      <p className="text-xs tracking-[0.25em] uppercase text-sunDeep font-medium mb-3">
        ✦ {eyebrow} ✦
      </p>
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-inkSoft mt-4 text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
