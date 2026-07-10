"use client";

import { GlassCard } from "@/components/landing/primitives/glass-card";
import { cn } from "@/lib/utils";
import type { PreferredContact } from "@/types/booking";
import { Mail, MessageCircle, Phone, User } from "lucide-react";

type StepCustomerProps = {
  fullName: string;
  phone: string;
  email: string;
  whatsapp: string;
  preferredContact: PreferredContact;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
};

const contactOptions: { value: PreferredContact; label: string; icon: typeof Phone }[] = [
  { value: "phone", label: "Phone", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

const inputClass =
  "h-14 w-full rounded-xl border-2 border-white/15 bg-white/5 px-4 text-base text-white placeholder:text-white/30 focus:border-[var(--landing-green)] focus:outline-none focus:ring-2 focus:ring-[var(--landing-green)]/30";

export function StepCustomer({
  fullName,
  phone,
  email,
  whatsapp,
  preferredContact,
  onChange,
  errors = {},
}: StepCustomerProps) {
  return (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Your contact details
        </h2>
        <p className="mt-2 text-white/60">
          We&apos;ll use this to confirm your booking.
        </p>
      </header>

      <GlassCard className="space-y-5">
        <Field
          id="fullName"
          label="Full Name"
          required
          icon={User}
          value={fullName}
          onChange={(v) => onChange("fullName", v)}
          error={errors.fullName}
          placeholder="John Mukasa"
        />
        <Field
          id="phone"
          label="Phone Number"
          required
          icon={Phone}
          type="tel"
          value={phone}
          onChange={(v) => onChange("phone", v)}
          error={errors.phone}
          placeholder="+256 7XX XXX XXX"
        />
        <Field
          id="email"
          label="Email Address"
          required
          icon={Mail}
          type="email"
          value={email}
          onChange={(v) => onChange("email", v)}
          error={errors.email}
          placeholder="you@example.com"
        />
        <Field
          id="whatsapp"
          label="WhatsApp Number"
          icon={MessageCircle}
          type="tel"
          value={whatsapp}
          onChange={(v) => onChange("whatsapp", v)}
          error={errors.whatsapp}
          placeholder="Optional — same as phone is fine"
          optional
        />

        <div className="space-y-2 pt-2">
          <p className="text-sm font-semibold text-white/80">
            Preferred contact method
          </p>
          <div className="flex flex-wrap gap-2">
            {contactOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange("preferredContact", value)}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-bold transition-all",
                  preferredContact === value
                    ? "bg-[var(--landing-green)] text-white"
                    : "border-2 border-white/20 bg-white/5 text-white/70 hover:border-white/40",
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  icon: Icon,
  type = "text",
  placeholder,
  required,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon: typeof User;
  type?: string;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-white/80">
        <Icon className="size-4 text-[var(--landing-green)]" />
        {label}
        {required && <span className="text-[var(--landing-gold)]">*</span>}
        {optional && (
          <span className="text-xs font-normal text-white/40">(optional)</span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(inputClass, error && "border-red-400")}
        autoComplete={
          id === "fullName"
            ? "name"
            : id === "email"
              ? "email"
              : id === "phone" || id === "whatsapp"
                ? "tel"
                : undefined
        }
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
