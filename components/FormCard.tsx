"use client";

import { ReactNode } from "react";

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass shadow-card p-6 sm:p-8 ${className}`}>{children}</div>;
}

export function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium text-cream tracking-wide">
          {label}
          {required && <span className="text-gold ml-1">*</span>}
        </span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-danger text-xs mt-1.5">{error}</p>}
    </label>
  );
}

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: { value: T; label: string; sub?: string; icon?: ReactNode }[];
  value: T | "";
  onChange: (v: T) => void;
  columns?: 1 | 2;
}) {
  return (
    <div className={`grid gap-3 ${columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`chip ${active ? "chip-active" : ""}`}
          >
            <span className="chip-radio-dot" />
            {opt.icon && <span className="text-gold">{opt.icon}</span>}
            <span className="flex-1 text-left">
              <span className="block text-cream">{opt.label}</span>
              {opt.sub && <span className="block text-xs text-muted mt-0.5">{opt.sub}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function StepIndicator({
  steps,
  current,
}: {
  steps: { label: string }[];
  current: number;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={s.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    done
                      ? "bg-gold text-cosmos"
                      : active
                      ? "bg-gold text-cosmos shadow-glowStrong"
                      : "bg-cosmos border border-muted/40 text-muted"
                  }`}
                >
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-[11px] mt-2 hidden sm:block transition-colors ${
                    active ? "text-gold" : done ? "text-cream/70" : "text-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mx-1 mb-5 sm:mb-7">
                  <div
                    className={`h-full transition-colors ${
                      done ? "bg-gold" : "bg-muted/25"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BottomBar({
  back,
  forward,
  submitting,
  isLast,
  canForward,
}: {
  back?: () => void;
  forward: () => void;
  submitting?: boolean;
  isLast?: boolean;
  canForward: boolean;
}) {
  return (
    <div className="sticky bottom-0 -mx-4 px-4 pb-4 pt-4 sm:static sm:mx-0 sm:px-0 sm:pb-0 sm:pt-2 backdrop-blur-md sm:backdrop-blur-0 bg-midnight/60 sm:bg-transparent border-t border-gold/10 sm:border-0">
      <div className="flex items-center justify-between gap-3">
        {back ? (
          <button type="button" onClick={back} className="btn-ghost">
            ← Back
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={forward}
          disabled={!canForward || submitting}
          className="btn-gold flex items-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Submitting...
            </>
          ) : isLast ? (
            <>Confirm booking ✦</>
          ) : (
            <>Continue →</>
          )}
        </button>
      </div>
    </div>
  );
}
