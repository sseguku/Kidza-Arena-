"use client";

import { cn } from "@/lib/utils";
import { BOOKING_STEPS } from "@/lib/booking/constants";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

type BookingStepperProps = {
  currentStep: number;
  className?: string;
};

export function BookingStepper({ currentStep, className }: BookingStepperProps) {
  const visibleSteps = BOOKING_STEPS.filter((s) => s.id <= 5);

  return (
    <nav aria-label="Booking progress" className={cn("w-full", className)}>
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {visibleSteps.map((step, index) => {
          const isComplete = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex w-full flex-col items-center gap-1.5 sm:gap-2">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 sm:size-10 sm:text-sm",
                    isComplete &&
                      "border-[var(--landing-green)] bg-[var(--landing-green)] text-white",
                    isCurrent &&
                      "border-[var(--landing-gold)] bg-[var(--landing-gold)] text-[#0b0f14] shadow-glow-gold",
                    isUpcoming && "border-white/20 bg-white/5 text-white/40",
                  )}
                >
                  {isComplete ? (
                    <Check className="size-4 sm:size-5" strokeWidth={3} />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "hidden text-center text-[10px] font-semibold uppercase tracking-wider sm:block sm:text-xs",
                    isCurrent ? "text-[var(--landing-gold)]" : "text-white/50",
                  )}
                >
                  {step.short}
                </span>
              </div>
              {index < visibleSteps.length - 1 && (
                <motion.div
                  className={cn(
                    "mx-1 h-0.5 flex-1 rounded-full sm:mx-2",
                    isComplete ? "bg-[var(--landing-green)]" : "bg-white/10",
                  )}
                  initial={false}
                  animate={{ scaleX: isComplete ? 1 : 0.6 }}
                  style={{ originX: 0 }}
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-center text-sm text-white/60 sm:hidden">
        Step {Math.min(currentStep, 5)} of 5 —{" "}
        {visibleSteps.find((s) => s.id === currentStep)?.label ?? "Done"}
      </p>
    </nav>
  );
}
