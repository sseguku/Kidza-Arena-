"use client";

import type { ReactNode } from "react";
import { BookingPriceBadge } from "@/components/booking/booking-price-badge";
import { GlassCard } from "@/components/landing/primitives/glass-card";
import { formatTimeLabel, MATCH_TYPE_OPTIONS } from "@/lib/booking/constants";
import {
  calculateBookingPrice,
  getSessionPeriod,
} from "@/lib/booking/pricing";
import { cn } from "@/lib/utils";
import type { BookingFormState } from "@/types/booking";
import { Calendar, Clock, Mail, Phone, User, Users } from "lucide-react";

type StepSummaryProps = {
  values: BookingFormState;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  errors?: Record<string, string>;
  submitError?: string;
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y!, m! - 1, d!).toLocaleDateString("en-UG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function matchTypeLabel(value: string): string {
  return MATCH_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function StepSummary({
  values,
  termsAccepted,
  onTermsChange,
  errors = {},
  submitError,
}: StepSummaryProps) {
  if (!values.bookingType) return null;

  const price = calculateBookingPrice({
    bookingType: values.bookingType,
    durationHours: values.durationHours,
    playerCount: values.playerCount,
  });

  const sessionPeriod = values.startTime
    ? getSessionPeriod(values.startTime)
    : null;

  const hour = values.startTime
    ? parseInt(values.startTime.split(":")[0] ?? "0", 10)
    : 0;

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Review your booking
        </h2>
        <p className="mt-2 text-white/60">
          Please confirm everything looks correct before submitting.
        </p>
      </header>

      {submitError && (
        <div
          className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-center text-sm text-red-300"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <GlassCard className="space-y-6">
        <SummarySection title="Booking">
          <SummaryRow
            label="Type"
            value={
              values.bookingType === "individual"
                ? "Individual Play"
                : "Team Booking"
            }
          />
          <SummaryRow
            icon={Calendar}
            label="Date"
            value={formatDate(values.date)}
          />
          <SummaryRow
            icon={Clock}
            label="Time"
            value={
              values.startTime
                ? `${formatTimeLabel(hour)} · ${values.durationHours}h · ${sessionPeriod} session`
                : "—"
            }
          />
          {values.bookingType === "team" && values.teamName && (
            <SummaryRow label="Team" value={values.teamName} />
          )}
          {values.bookingType === "team" && values.matchType && (
            <SummaryRow
              label="Match type"
              value={matchTypeLabel(values.matchType)}
            />
          )}
          <SummaryRow
            icon={Users}
            label="Players"
            value={String(values.playerCount)}
          />
          {values.skillLevel && values.bookingType === "individual" && (
            <SummaryRow
              label="Skill level"
              value={values.skillLevel.replace("_", " ")}
            />
          )}
        </SummarySection>

        <hr className="border-white/10" />

        <SummarySection title="Contact">
          <SummaryRow icon={User} label="Name" value={values.fullName} />
          <SummaryRow icon={Phone} label="Phone" value={values.phone} />
          <SummaryRow icon={Mail} label="Email" value={values.email} />
          {values.whatsapp && (
            <SummaryRow label="WhatsApp" value={values.whatsapp} />
          )}
          <SummaryRow
            label="Preferred contact"
            value={values.preferredContact}
          />
        </SummarySection>

        {values.notes && (
          <>
            <hr className="border-white/10" />
            <SummarySection title="Notes">
              <p className="text-sm leading-relaxed text-white/70">
                {values.notes}
              </p>
            </SummarySection>
          </>
        )}

        <BookingPriceBadge amount={price} label="Total price" />

        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors",
            termsAccepted
              ? "border-[var(--landing-green)] bg-[var(--landing-green)]/10"
              : "border-white/15 bg-white/5",
            errors.termsAccepted && "border-red-400",
          )}
        >
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="mt-1 size-5 shrink-0 accent-[var(--landing-green)]"
          />
          <span className="text-sm leading-relaxed text-white/80">
            I agree to the{" "}
            <a
              href="/terms"
              className="font-semibold text-[var(--landing-gold)] underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms and Conditions
            </a>{" "}
            and understand that my booking is subject to administrator approval
            and payment confirmation.
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-sm text-red-400">{errors.termsAccepted}</p>
        )}
      </GlassCard>
    </div>
  );
}

function SummarySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--landing-gold)]">
        {title}
      </h3>
      <dl className="space-y-2">{children}</dl>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof User;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <dt className="flex items-center gap-2 text-white/50">
        {Icon && <Icon className="size-3.5 shrink-0" />}
        {label}
      </dt>
      <dd className="text-right font-medium capitalize text-white">{value}</dd>
    </div>
  );
}
