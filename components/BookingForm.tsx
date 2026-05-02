"use client";

import { useState, useMemo, useEffect } from "react";
import {
  GlassCard,
  Field,
  ChipGroup,
  StepIndicator,
  BottomBar,
} from "@/components/FormCard";

type FormState = {
  fullName: string;
  countryCode: string;
  mobile: string;
  email: string;
  dob: string;
  timeOfBirth: string;
  placeOfBirth: string;
  gender: "Male" | "Female" | "";
  consultationType: "Astrology" | "Numerology" | "Both" | "";
  consultationDuration: "30 minutes" | "60 minutes" | "";
  consultationDate: string;
  consultationTime: string;
};

const initial: FormState = {
  fullName: "",
  countryCode: "+91",
  mobile: "",
  email: "",
  dob: "",
  timeOfBirth: "",
  placeOfBirth: "",
  gender: "",
  consultationType: "",
  consultationDuration: "",
  consultationDate: "",
  consultationTime: "",
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

async function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const STEPS = [
  { label: "About you" },
  { label: "Birth details" },
  { label: "Your session" },
  { label: "Payment & slot" },
];

export const PRICES: Record<string, number> = {
  "30 minutes": 1600,
  "60 minutes": 3200,
};

const today = () => {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
};

export default function BookingForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<FormState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  };

  const amount = useMemo(
    () => (form.consultationDuration ? PRICES[form.consultationDuration] : null),
    [form.consultationDuration]
  );

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validateMobile = (m: string) => /^\d{7,15}$/.test(m.replace(/\D/g, ""));

  const stepValid = (s: number): boolean => {
    if (s === 0) {
      return (
        form.fullName.trim().length > 1 &&
        !!form.countryCode &&
        validateMobile(form.mobile) &&
        validateEmail(form.email)
      );
    }
    if (s === 1) {
      return (
        !!form.dob &&
        !!form.timeOfBirth &&
        form.placeOfBirth.trim().length > 1 &&
        !!form.gender
      );
    }
    if (s === 2) {
      return !!form.consultationType && !!form.consultationDuration;
    }
    if (s === 3) {
      return !!form.consultationDate && !!form.consultationTime;
    }
    return false;
  };

  const next = () => {
    if (!stepValid(step)) {
      setError("Please complete all required fields before continuing.");
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    if (typeof document !== "undefined") {
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const back = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const formatTime = (t: string) => {
    if (!t) return "";
    const [hh, mm] = t.split(":");
    const h = parseInt(hh, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(h12).padStart(2, "0")}:${mm} ${ampm}`;
  };

  const submit = async () => {
    if (!stepValid(3)) {
      setError("Please pick a date and time before continuing.");
      return;
    }
    if (!amount) {
      setError("Please pick a duration first.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const ready = await loadRazorpay();
      if (!ready) throw new Error("Could not load payment gateway. Check your connection.");

      const fullMobile = `${form.countryCode} ${form.mobile.replace(/\D/g, "")}`;

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration: form.consultationDuration,
          fullName: form.fullName,
          email: form.email,
          mobile: fullMobile,
        }),
      });
      if (!orderRes.ok) {
        const t = await orderRes.text();
        throw new Error(t || "Failed to create payment order.");
      }
      const order = (await orderRes.json()) as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };

      await new Promise<void>((resolve, reject) => {
        const rp = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: "Astro Anikita",
          description: `${form.consultationType} · ${form.consultationDuration}`,
          image: "/anikita.jpg",
          theme: { color: "#F5B700" },
          prefill: {
            name: form.fullName,
            email: form.email,
            contact: fullMobile,
          },
          notes: {
            consultationType: form.consultationType,
            consultationDuration: form.consultationDuration,
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled.")),
          },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const submitRes = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  fullName: form.fullName,
                  mobile: fullMobile,
                  email: form.email,
                  dob: form.dob,
                  timeOfBirth: formatTime(form.timeOfBirth),
                  placeOfBirth: form.placeOfBirth,
                  gender: form.gender,
                  consultationType: form.consultationType,
                  consultationDuration: form.consultationDuration,
                  consultationDate: form.consultationDate,
                  consultationTime: formatTime(form.consultationTime),
                  amount,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              if (!submitRes.ok) {
                const t = await submitRes.text();
                throw new Error(t || "Submission failed after payment.");
              }
              setSubmitted(form);
              setForm(initial);
              setStep(0);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
        });
        rp.open();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return <SuccessScreen booking={submitted} onAgain={() => setSubmitted(null)} />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <StepIndicator steps={STEPS} current={step} />
      </div>

      <GlassCard className="mb-4">
        {step === 0 && <StepAbout form={form} set={set} />}
        {step === 1 && <StepBirth form={form} set={set} />}
        {step === 2 && <StepSession form={form} set={set} amount={amount} />}
        {step === 3 && <StepPayment form={form} set={set} amount={amount} />}
      </GlassCard>

      {error && (
        <div className="card border-danger/40 px-4 py-3 mb-3 text-sm text-danger">
          {error}
        </div>
      )}

      <BottomBar
        back={step > 0 ? back : undefined}
        forward={step === STEPS.length - 1 ? submit : next}
        submitting={submitting}
        isLast={step === STEPS.length - 1}
        canForward={stepValid(step)}
      />
    </div>
  );
}

function StepAbout({
  form,
  set,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="step-enter space-y-5">
      <h2 className="font-serif text-2xl text-ink mb-1">About you</h2>
      <p className="text-sm text-muted mb-5">We need this to personalize your reading and reach you.</p>

      <Field label="Full name" required>
        <input
          className="input"
          type="text"
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
        />
      </Field>

      <Field label="Mobile (WhatsApp)" required>
        <PhoneInput
          countryCode={form.countryCode}
          mobile={form.mobile}
          onCountryCode={(v) => set("countryCode", v)}
          onMobile={(v) => set("mobile", v)}
        />
      </Field>

      <Field label="Email" required>
        <input
          className="input"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </Field>
    </div>
  );
}

function StepBirth({
  form,
  set,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="step-enter space-y-5">
      <h2 className="font-serif text-2xl text-ink mb-1">Birth details</h2>
      <p className="text-sm text-muted mb-5">
        For an accurate chart we need your exact birth time and place.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date of birth" required>
          <input
            className="input"
            type="date"
            max={today()}
            value={form.dob}
            onChange={(e) => set("dob", e.target.value)}
          />
        </Field>

        <Field label="Time of birth" required hint="As exact as possible">
          <input
            className="input"
            type="time"
            value={form.timeOfBirth}
            onChange={(e) => set("timeOfBirth", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Place of birth" required hint="City, State, Country">
        <input
          className="input"
          type="text"
          placeholder="Mumbai, Maharashtra, India"
          value={form.placeOfBirth}
          onChange={(e) => set("placeOfBirth", e.target.value)}
        />
      </Field>

      <Field label="Gender" required>
        <ChipGroup
          columns={2}
          value={form.gender}
          onChange={(v) => set("gender", v)}
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
          ]}
        />
      </Field>
    </div>
  );
}

function StepSession({
  form,
  set,
  amount,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  amount: number | null;
}) {
  return (
    <div className="step-enter space-y-6">
      <h2 className="font-serif text-2xl text-ink mb-1">Your session</h2>
      <p className="text-sm text-muted">Pick what brings you here today.</p>

      <Field label="Consultation type" required>
        <ChipGroup
          columns={2}
          value={form.consultationType}
          onChange={(v) => set("consultationType", v)}
          options={[
            { value: "Astrology", label: "Astrology", sub: "Birth chart, planetary insights" },
            { value: "Numerology", label: "Numerology", sub: "Numbers shaping your path" },
            { value: "Both", label: "Both", sub: "Combined deep reading" },
          ]}
        />
      </Field>

      <Field label="Duration" required>
        <ChipGroup
          columns={2}
          value={form.consultationDuration}
          onChange={(v) => set("consultationDuration", v)}
          options={[
            { value: "30 minutes", label: "30 minutes", sub: "Rs. 1,600" },
            { value: "60 minutes", label: "60 minutes", sub: "Rs. 3,200" },
          ]}
        />
      </Field>

      {amount && (
        <div className="rounded-2xl bg-gradient-to-br from-cream to-surface border border-sun/40 p-5 text-center shadow-soft">
          <p className="text-xs tracking-widest uppercase text-inkSoft mb-1">Total payable</p>
          <p className="font-serif text-3xl text-sun-grad">₹ {amount.toLocaleString("en-IN")}</p>
          <p className="text-xs text-muted mt-2">Continue to pay & confirm your slot</p>
        </div>
      )}
    </div>
  );
}

function StepPayment({
  form,
  set,
  amount,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  amount: number | null;
}) {
  return (
    <div className="step-enter space-y-6">
      <h2 className="font-serif text-2xl text-ink mb-1">Pick your slot</h2>
      <p className="text-sm text-muted">Choose a date and time, then confirm to pay securely.</p>

      <div className="rounded-2xl bg-gradient-to-br from-cream to-surface border border-sun/40 p-5 text-center shadow-soft">
        <p className="text-xs tracking-widest uppercase text-inkSoft">Total payable</p>
        <p className="font-serif text-4xl text-sun-grad mt-1">
          ₹ {amount ? amount.toLocaleString("en-IN") : "—"}
        </p>
        <p className="text-xs text-muted mt-2">
          {form.consultationType} · {form.consultationDuration}
        </p>
      </div>

      <SlotPicker
        date={form.consultationDate}
        time={form.consultationTime}
        durationMins={form.consultationDuration === "60 minutes" ? 60 : 30}
        onDate={(d) => set("consultationDate", d)}
        onTime={(t) => set("consultationTime", t)}
      />

      <div className="rounded-2xl border border-border bg-surface/60 p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-sun-grad flex items-center justify-center text-ink shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div className="text-xs text-inkSoft leading-relaxed">
          <p className="text-ink font-medium mb-0.5">Secure payment via Razorpay</p>
          UPI, cards, netbanking, and wallets accepted. Your slot is confirmed instantly on successful payment.
        </div>
      </div>
    </div>
  );
}

const COUNTRY_CODES: { code: string; label: string; flag: string }[] = [
  { code: "+91", label: "India", flag: "🇮🇳" },
  { code: "+1", label: "USA / Canada", flag: "🇺🇸" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", label: "UAE", flag: "🇦🇪" },
  { code: "+65", label: "Singapore", flag: "🇸🇬" },
  { code: "+61", label: "Australia", flag: "🇦🇺" },
  { code: "+60", label: "Malaysia", flag: "🇲🇾" },
  { code: "+64", label: "New Zealand", flag: "🇳🇿" },
  { code: "+49", label: "Germany", flag: "🇩🇪" },
  { code: "+33", label: "France", flag: "🇫🇷" },
  { code: "+966", label: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", label: "Qatar", flag: "🇶🇦" },
  { code: "+968", label: "Oman", flag: "🇴🇲" },
  { code: "+973", label: "Bahrain", flag: "🇧🇭" },
  { code: "+965", label: "Kuwait", flag: "🇰🇼" },
  { code: "+92", label: "Pakistan", flag: "🇵🇰" },
  { code: "+880", label: "Bangladesh", flag: "🇧🇩" },
  { code: "+977", label: "Nepal", flag: "🇳🇵" },
  { code: "+94", label: "Sri Lanka", flag: "🇱🇰" },
  { code: "+27", label: "South Africa", flag: "🇿🇦" },
  { code: "+81", label: "Japan", flag: "🇯🇵" },
];

function PhoneInput({
  countryCode,
  mobile,
  onCountryCode,
  onMobile,
}: {
  countryCode: string;
  mobile: string;
  onCountryCode: (v: string) => void;
  onMobile: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <div className="relative shrink-0" style={{ width: "118px" }}>
        <select
          aria-label="Country code"
          value={countryCode}
          onChange={(e) => onCountryCode(e.target.value)}
          className="input appearance-none cursor-pointer pr-8 font-medium"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-muted">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      <input
        className="input flex-1"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="98765 43210"
        value={mobile}
        onChange={(e) => onMobile(e.target.value.replace(/[^\d\s-]/g, ""))}
      />
    </div>
  );
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function toIsoDate(d: Date) {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function formatSlot(s: string) {
  const [hh, mm] = s.split(":").map(Number);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

function SlotPicker({
  date,
  time,
  durationMins,
  onDate,
  onTime,
}: {
  date: string;
  time: string;
  durationMins: 30 | 60;
  onDate: (d: string) => void;
  onTime: (t: string) => void;
}) {
  const days = useMemo(() => {
    const out: Date[] = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  const slots = useMemo(() => {
    const out: string[] = [];
    const startMins = 12 * 60;
    const endMins = 19 * 60;
    for (let m = startMins; m <= endMins; m += durationMins) {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      out.push(`${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
    }
    return out;
  }, [durationMins]);

  const todayIso = toIsoDate(new Date());

  const isSlotPast = (dateStr: string, slot: string): boolean => {
    if (dateStr !== todayIso) return false;
    const [hh, mm] = slot.split(":").map(Number);
    const slotTime = new Date();
    slotTime.setHours(hh, mm, 0, 0);
    return slotTime.getTime() <= Date.now();
  };

  const dateHasAvailableSlots = (d: Date): boolean => {
    const ds = toIsoDate(d);
    return slots.some((s) => !isSlotPast(ds, s));
  };

  useEffect(() => {
    if (time && !slots.includes(time)) onTime("");
  }, [time, slots, onTime]);

  useEffect(() => {
    if (date && time && isSlotPast(date, time)) onTime("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, time]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-ink mb-3">
          Select a date <span className="text-sun">*</span>
          <span className="text-xs text-muted font-normal ml-2">Next 7 days</span>
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {days.map((d) => {
            const ds = toIsoDate(d);
            const active = date === ds;
            const disabled = !dateHasAvailableSlots(d);
            const isToday = ds === todayIso;
            return (
              <button
                key={ds}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onDate(ds);
                  if (time && isSlotPast(ds, time)) onTime("");
                }}
                className={`flex-shrink-0 w-[78px] py-3 rounded-2xl border-2 transition-all text-center ${
                  active
                    ? "border-sun bg-gradient-to-br from-cream to-surface shadow-soft"
                    : disabled
                    ? "border-border bg-surface/50 opacity-40 cursor-not-allowed"
                    : "border-border bg-surface hover:border-sun hover:bg-cream/40"
                }`}
              >
                <div className="text-[10px] tracking-widest uppercase text-muted">
                  {isToday ? "Today" : DAY_NAMES[d.getDay()]}
                </div>
                <div className={`font-serif text-2xl mt-0.5 ${active ? "text-sun-grad" : "text-ink"}`}>
                  {d.getDate()}
                </div>
                <div className="text-[10px] text-muted mt-0.5">{MONTH_NAMES[d.getMonth()]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {date && (
        <div>
          <p className="text-sm font-medium text-ink mb-3">
            Select a time <span className="text-sun">*</span>
            <span className="text-xs text-muted font-normal ml-2">
              {durationMins} min slots · 12 PM – 7 PM
            </span>
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map((s) => {
              const past = isSlotPast(date, s);
              const active = time === s;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={past}
                  onClick={() => onTime(s)}
                  className={`px-3 py-2.5 rounded-xl border-2 text-sm transition-all ${
                    active
                      ? "border-sun bg-gradient-to-br from-cream to-surface text-ink font-medium shadow-soft"
                      : past
                      ? "border-border bg-surface/40 text-muted line-through opacity-50 cursor-not-allowed"
                      : "border-border bg-surface text-ink hover:border-sun hover:bg-cream/40"
                  }`}
                >
                  {formatSlot(s)}
                </button>
              );
            })}
          </div>
          {slots.every((s) => isSlotPast(date, s)) && (
            <p className="text-xs text-muted mt-3 text-center">
              No more slots available today. Please choose another date.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SuccessScreen({
  booking,
  onAgain,
}: {
  booking: FormState;
  onAgain: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8 step-enter">
        <div className="inline-flex w-20 h-20 rounded-full bg-sun-grad items-center justify-center mb-5 shadow-glowStrong animate-float">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2B1810" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-serif text-4xl text-ink mb-2">Booking received ✦</h2>
        <p className="text-inkSoft">
          Thank you, {booking.fullName.split(" ")[0]}. Your consultation is being processed.
        </p>
      </div>

      <GlassCard className="step-enter">
        <h3 className="font-serif text-xl text-sunDeep mb-4">Your booking details</h3>
        <dl className="space-y-3 text-sm">
          <Row k="Session" v={`${booking.consultationType} · ${booking.consultationDuration}`} />
          <Row k="Date" v={booking.consultationDate} />
          <Row k="Time" v={booking.consultationTime} />
          <Row k="Amount paid" v={`₹ ${PRICES[booking.consultationDuration]?.toLocaleString("en-IN")}`} />
          <Row k="WhatsApp" v={booking.mobile} />
          <Row k="Email" v={booking.email} />
        </dl>
      </GlassCard>

      <div className="card mt-4 p-6 step-enter">
        <h4 className="font-serif text-lg text-ink mb-3">What happens next</h4>
        <ol className="space-y-3 text-sm text-inkSoft">
          <li className="flex gap-3">
            <span className="text-sunDeep flex-shrink-0 font-semibold">1.</span>
            <span>Your payment is confirmed and your slot is locked in.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-sunDeep flex-shrink-0 font-semibold">2.</span>
            <span>A confirmation email with your booking summary has been sent to {booking.email}.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-sunDeep flex-shrink-0 font-semibold">3.</span>
            <span>You'll receive a WhatsApp message with the Google Meet link before your session.</span>
          </li>
        </ol>
      </div>

      <div className="text-center mt-8">
        <button onClick={onAgain} className="btn-ghost">
          Book another session
        </button>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <dt className="text-muted">{k}</dt>
      <dd className="text-ink text-right font-medium">{v}</dd>
    </div>
  );
}
