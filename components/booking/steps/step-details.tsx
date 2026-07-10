"use client";

import { GlassCard } from "@/components/landing/primitives/glass-card";
import {
  MATCH_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
} from "@/lib/booking/constants";
import { cn } from "@/lib/utils";
import type { BookingType, MatchType, SkillLevel } from "@/types/booking";
import { Minus, Plus, Users } from "lucide-react";

type StepDetailsProps = {
  bookingType: BookingType;
  playerCount: number;
  skillLevel: SkillLevel | "";
  teamName: string;
  matchType: MatchType | "";
  notes: string;
  onChange: (field: string, value: string | number) => void;
  errors?: Record<string, string>;
};

const textareaClass =
  "min-h-[120px] w-full resize-y rounded-xl border-2 border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-[var(--landing-green)] focus:outline-none focus:ring-2 focus:ring-[var(--landing-green)]/30";

export function StepDetails({
  bookingType,
  playerCount,
  skillLevel,
  teamName,
  matchType,
  notes,
  onChange,
  errors = {},
}: StepDetailsProps) {
  const minPlayers = bookingType === "team" ? 5 : 1;
  const maxPlayers = 30;

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Booking details
        </h2>
        <p className="mt-2 text-white/60">
          {bookingType === "team"
            ? "Tell us about your team and session."
            : "Help us prepare for your session."}
        </p>
      </header>

      <GlassCard className="space-y-5">
        {bookingType === "team" && (
          <div className="space-y-2">
            <label
              htmlFor="teamName"
              className="text-sm font-semibold text-white/80"
            >
              Team Name <span className="text-[var(--landing-gold)]">*</span>
            </label>
            <input
              id="teamName"
              value={teamName}
              onChange={(e) => onChange("teamName", e.target.value)}
              placeholder="e.g. Busega United FC"
              className={cn(
                "h-14 w-full rounded-xl border-2 border-white/15 bg-white/5 px-4 text-base text-white placeholder:text-white/30 focus:border-[var(--landing-green)] focus:outline-none",
                errors.teamName && "border-red-400",
              )}
            />
            {errors.teamName && (
              <p className="text-sm text-red-400">{errors.teamName}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
            <Users className="size-4 text-[var(--landing-green)]" />
            Number of players <span className="text-[var(--landing-gold)]">*</span>
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Decrease players"
              disabled={playerCount <= minPlayers}
              onClick={() => onChange("playerCount", Math.max(minPlayers, playerCount - 1))}
              className="flex size-12 items-center justify-center rounded-full border-2 border-white/20 bg-white/5 text-white transition hover:border-[var(--landing-green)] disabled:opacity-30"
            >
              <Minus className="size-5" />
            </button>
            <span className="min-w-[3rem] text-center text-3xl font-bold text-[var(--landing-gold)]">
              {playerCount}
            </span>
            <button
              type="button"
              aria-label="Increase players"
              disabled={playerCount >= maxPlayers}
              onClick={() => onChange("playerCount", Math.min(maxPlayers, playerCount + 1))}
              className="flex size-12 items-center justify-center rounded-full border-2 border-white/20 bg-white/5 text-white transition hover:border-[var(--landing-green)] disabled:opacity-30"
            >
              <Plus className="size-5" />
            </button>
          </div>
          {errors.playerCount && (
            <p className="text-sm text-red-400">{errors.playerCount}</p>
          )}
        </div>

        {bookingType === "team" && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white/80">
              Match type <span className="text-[var(--landing-gold)]">*</span>
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {MATCH_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange("matchType", opt.value)}
                  className={cn(
                    "min-h-12 rounded-xl px-3 text-sm font-bold transition-all",
                    matchType === opt.value
                      ? "bg-[var(--landing-green)] text-white"
                      : "border-2 border-white/20 bg-white/5 text-white/70 hover:border-white/40",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.matchType && (
              <p className="text-sm text-red-400">{errors.matchType}</p>
            )}
          </div>
        )}

        {bookingType === "individual" && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white/80">
              Skill level{" "}
              <span className="text-xs font-normal text-white/40">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILL_LEVEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange("skillLevel", opt.value)}
                  className={cn(
                    "min-h-10 rounded-full px-4 text-sm font-bold transition-all",
                    skillLevel === opt.value
                      ? "bg-[var(--landing-gold)] text-[#0b0f14]"
                      : "border-2 border-white/20 bg-white/5 text-white/70 hover:border-white/40",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-semibold text-white/80">
            Additional notes{" "}
            <span className="text-xs font-normal text-white/40">(optional)</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder={
              bookingType === "team"
                ? "Equipment needs, special requests…"
                : "Anything we should know?"
            }
            className={textareaClass}
            maxLength={1000}
          />
        </div>
      </GlassCard>
    </div>
  );
}
