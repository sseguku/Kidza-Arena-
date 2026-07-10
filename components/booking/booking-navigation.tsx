"use client";

import { LandingButtonNative } from "@/components/landing/primitives/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

type BookingNavigationProps = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  showBack?: boolean;
  isLoading?: boolean;
  isNextDisabled?: boolean;
  className?: string;
};

export function BookingNavigation({
  onBack,
  onNext,
  nextLabel = "Continue",
  showBack = true,
  isLoading = false,
  isNextDisabled = false,
  className,
}: BookingNavigationProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {showBack && onBack ? (
        <LandingButtonNative
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="size-5" />
          Back
        </LandingButtonNative>
      ) : (
        <div className="hidden sm:block" />
      )}

      {onNext && (
        <LandingButtonNative
          variant="primary"
          size="lg"
          onClick={onNext}
          disabled={isLoading || isNextDisabled}
          className="w-full sm:ml-auto sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Please wait…
            </>
          ) : (
            <>
              {nextLabel}
              <ArrowRight className="size-5" />
            </>
          )}
        </LandingButtonNative>
      )}
    </div>
  );
}
