"use client";

/**
 * Standard password field for the app: masked by default, optional visibility toggle,
 * wired label (htmlFor), and meaningful autocomplete for browsers/password managers.
 * Use this for login, sign-up, confirm password, change-password, etc.
 */

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const inputClass =
  "w-full h-12 pl-4 pr-12 rounded-xl bg-surface-2 border border-white/[0.08] text-white placeholder:text-white/20 outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all font-body";

const labelClass =
  "text-[11px] uppercase tracking-wider text-white/30 font-semibold mb-1.5 block";

export type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete */
  autoComplete?: "current-password" | "new-password";
  minLength?: number;
  required?: boolean;
  name?: string;
  /** Set false only if you intentionally omit the reveal control (rare). */
  showVisibilityToggle?: boolean;
};

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
  minLength = 8,
  required = true,
  name,
  showVisibilityToggle = true,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (value === "") setVisible(false);
  }, [value]);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name ?? id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          spellCheck={false}
          className={inputClass}
          placeholder={placeholder}
        />
        {showVisibilityToggle && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-gold/35 bg-surface-0/95 text-gold shadow-md shadow-black/25 ring-1 ring-black/20 transition-colors hover:border-gold/55 hover:bg-surface-0 hover:text-gold-light dark:ring-white/10"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
          >
            {visible ? (
              <EyeOff className="h-4 w-4 shrink-0 stroke-[2.25]" aria-hidden />
            ) : (
              <Eye className="h-4 w-4 shrink-0 stroke-[2.25]" aria-hidden />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
