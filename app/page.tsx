"use client";

import { useState } from "react";
import Image from "next/image";
import { FormCard, Label, TextInput, Radio } from "@/components/FormCard";

type FormState = {
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  timeOfBirthHH: string;
  timeOfBirthMM: string;
  timeOfBirthAmPm: "AM" | "PM";
  placeOfBirth: string;
  gender: string;
  consultationType: string;
  consultationDuration: string;
  paymentScreenshot: File | null;
  consultationDate: string;
  consultationTimeHH: string;
  consultationTimeMM: string;
  consultationTimeAmPm: "AM" | "PM";
};

const initial: FormState = {
  fullName: "",
  mobile: "",
  email: "",
  dob: "",
  timeOfBirthHH: "",
  timeOfBirthMM: "",
  timeOfBirthAmPm: "AM",
  placeOfBirth: "",
  gender: "",
  consultationType: "",
  consultationDuration: "",
  paymentScreenshot: null,
  consultationDate: "",
  consultationTimeHH: "",
  consultationTimeMM: "",
  consultationTimeAmPm: "AM",
};

export default function Page() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setForm(initial);
    setSubmitted(false);
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.paymentScreenshot) {
      setError("Please upload the payment confirmation screenshot.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      const tob = `${form.timeOfBirthHH.padStart(2, "0")}:${form.timeOfBirthMM.padStart(2, "0")} ${form.timeOfBirthAmPm}`;
      const cTime = `${form.consultationTimeHH.padStart(2, "0")}:${form.consultationTimeMM.padStart(2, "0")} ${form.consultationTimeAmPm}`;

      fd.append("fullName", form.fullName);
      fd.append("mobile", form.mobile);
      fd.append("email", form.email);
      fd.append("dob", form.dob);
      fd.append("timeOfBirth", tob);
      fd.append("placeOfBirth", form.placeOfBirth);
      fd.append("gender", form.gender);
      fd.append("consultationType", form.consultationType);
      fd.append("consultationDuration", form.consultationDuration);
      fd.append("consultationDate", form.consultationDate);
      fd.append("consultationTime", cTime);
      fd.append("paymentScreenshot", form.paymentScreenshot);

      const res = await fetch("/api/submit", { method: "POST", body: fd });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Submission failed");
      }
      setSubmitted(true);
      setForm(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-formBg py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <FormCard>
            <h1 className="text-2xl mb-3">Your response has been recorded.</h1>
            <p className="text-muted mb-6">
              Thank you for booking your consultation. We will reach out to confirm your slot.
            </p>
            <button
              type="button"
              onClick={reset}
              className="text-accent hover:underline"
            >
              Submit another response
            </button>
          </FormCard>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-formBg py-8 px-4">
      <form onSubmit={onSubmit} className="max-w-2xl mx-auto space-y-4">
        <FormCard>
          <h1 className="text-3xl font-normal mb-3">
            <span className="mr-1">🌍</span>Consultation Booking Form
          </h1>
          <p className="text-base text-[#202124] pb-4 border-b border-[#DADCE0]">
            Please fill in your details to book your session.
          </p>
          <p className="text-required text-sm mt-4">* Indicates required question</p>
        </FormCard>

        <FormCard>
          <Label htmlFor="fullName" required>Full Name</Label>
          <TextInput
            id="fullName"
            name="fullName"
            required
            value={form.fullName}
            onChange={(v) => set("fullName", v)}
          />
        </FormCard>

        <FormCard>
          <Label htmlFor="mobile" required>Mobile Number (Whatsapp Number)</Label>
          <TextInput
            id="mobile"
            name="mobile"
            type="tel"
            required
            value={form.mobile}
            onChange={(v) => set("mobile", v)}
          />
        </FormCard>

        <FormCard>
          <Label htmlFor="email" required>Email Address</Label>
          <TextInput
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={(v) => set("email", v)}
          />
        </FormCard>

        <FormCard>
          <Label htmlFor="dob" required>Date of Birth</Label>
          <p className="text-sm text-muted mb-2">Date</p>
          <input
            id="dob"
            type="date"
            required
            value={form.dob}
            onChange={(e) => set("dob", e.target.value)}
            className="bg-transparent border-0 border-b border-[#DADCE0] focus:border-accent focus:border-b-2 focus:outline-none text-base py-2"
          />
        </FormCard>

        <FormCard>
          <Label required>Time of Birth</Label>
          <p className="text-sm text-muted mb-2">Time</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={12}
              required
              value={form.timeOfBirthHH}
              onChange={(e) => set("timeOfBirthHH", e.target.value)}
              className="w-12 text-center bg-transparent border-0 border-b border-[#DADCE0] focus:border-accent focus:border-b-2 focus:outline-none text-base py-2"
            />
            <span>:</span>
            <input
              type="number"
              min={0}
              max={59}
              required
              value={form.timeOfBirthMM}
              onChange={(e) => set("timeOfBirthMM", e.target.value)}
              className="w-12 text-center bg-transparent border-0 border-b border-[#DADCE0] focus:border-accent focus:border-b-2 focus:outline-none text-base py-2"
            />
            <select
              value={form.timeOfBirthAmPm}
              onChange={(e) => set("timeOfBirthAmPm", e.target.value as "AM" | "PM")}
              className="ml-2 bg-transparent border-0 focus:outline-none text-base py-2"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </FormCard>

        <FormCard>
          <Label htmlFor="placeOfBirth" required>Place of Birth</Label>
          <TextInput
            id="placeOfBirth"
            name="placeOfBirth"
            required
            value={form.placeOfBirth}
            onChange={(v) => set("placeOfBirth", v)}
          />
        </FormCard>

        <FormCard>
          <Label required>Gender</Label>
          <Radio
            name="gender"
            value="Male"
            label="Male"
            checked={form.gender === "Male"}
            onChange={(v) => set("gender", v)}
          />
          <Radio
            name="gender"
            value="Female"
            label="Female"
            checked={form.gender === "Female"}
            onChange={(v) => set("gender", v)}
          />
        </FormCard>

        <FormCard>
          <Label required>Select Consultation Type</Label>
          {["Astrology", "Numerology", "Both", "Follow-up Consulation"].map((opt) => (
            <Radio
              key={opt}
              name="consultationType"
              value={opt}
              label={opt}
              checked={form.consultationType === opt}
              onChange={(v) => set("consultationType", v)}
            />
          ))}
        </FormCard>

        <FormCard>
          <Label required>Select Consultation Duration</Label>
          {["30 minutes", "60 minutes"].map((opt) => (
            <Radio
              key={opt}
              name="consultationDuration"
              value={opt}
              label={opt}
              checked={form.consultationDuration === opt}
              onChange={(v) => set("consultationDuration", v)}
            />
          ))}
        </FormCard>

        <FormCard>
          <h3 className="text-lg mb-2">Consultation Charges</h3>
          <p>30 minutes - Rs. 1600</p>
          <p>60 minutes - Rs. 2500</p>
        </FormCard>

        <FormCard>
          <p className="text-base mb-4">Please make the payment on the below QR</p>
          <div className="flex justify-center">
            <Image
              src="/payment-qr.png"
              alt="Payment QR code"
              width={360}
              height={360}
              priority
            />
          </div>
        </FormCard>

        <FormCard>
          <Label htmlFor="paymentScreenshot" required>Please Upload payment confirmation screenshot</Label>
          <p className="text-sm text-muted mb-3">Upload 1 supported file: image. Max 10 MB.</p>
          <label className="inline-flex items-center gap-2 border border-[#DADCE0] rounded px-4 py-2 cursor-pointer text-accent hover:bg-[#F8F7FC]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>{form.paymentScreenshot ? form.paymentScreenshot.name : "Add file"}</span>
            <input
              id="paymentScreenshot"
              type="file"
              accept="image/*"
              required
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                if (file && file.size > 10 * 1024 * 1024) {
                  setError("File exceeds 10 MB.");
                  return;
                }
                set("paymentScreenshot", file);
              }}
              className="hidden"
            />
          </label>
        </FormCard>

        <FormCard>
          <Label htmlFor="consultationDate" required>Select Consultation Date</Label>
          <p className="text-sm text-muted mb-2">Date</p>
          <input
            id="consultationDate"
            type="date"
            required
            value={form.consultationDate}
            onChange={(e) => set("consultationDate", e.target.value)}
            className="bg-transparent border-0 border-b border-[#DADCE0] focus:border-accent focus:border-b-2 focus:outline-none text-base py-2"
          />
        </FormCard>

        <FormCard>
          <Label required>Select Consultation Time</Label>
          <p className="text-sm text-muted mb-2">Time</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={12}
              required
              value={form.consultationTimeHH}
              onChange={(e) => set("consultationTimeHH", e.target.value)}
              className="w-12 text-center bg-transparent border-0 border-b border-[#DADCE0] focus:border-accent focus:border-b-2 focus:outline-none text-base py-2"
            />
            <span>:</span>
            <input
              type="number"
              min={0}
              max={59}
              required
              value={form.consultationTimeMM}
              onChange={(e) => set("consultationTimeMM", e.target.value)}
              className="w-12 text-center bg-transparent border-0 border-b border-[#DADCE0] focus:border-accent focus:border-b-2 focus:outline-none text-base py-2"
            />
            <select
              value={form.consultationTimeAmPm}
              onChange={(e) => set("consultationTimeAmPm", e.target.value as "AM" | "PM")}
              className="ml-2 bg-transparent border-0 focus:outline-none text-base py-2"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </FormCard>

        {error && (
          <FormCard>
            <p className="text-required">{error}</p>
          </FormCard>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-accent hover:bg-accentHover disabled:opacity-60 text-white font-medium px-6 py-2 rounded shadow-sm"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="text-accent hover:underline"
          >
            Clear form
          </button>
        </div>

        <p className="text-xs text-muted pt-4">
          Never submit passwords through this form.
        </p>
      </form>
    </main>
  );
}
