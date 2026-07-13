"use client";

import { submitBookingAction, getAvailabilityAction } from "@/app/(site)/book/actions";
import { BookingNavigation } from "@/components/booking/booking-navigation";
import { BookingStepper } from "@/components/booking/booking-stepper";
import { StepConfirmation } from "@/components/booking/steps/step-confirmation";
import { StepCustomer } from "@/components/booking/steps/step-customer";
import { StepDetails } from "@/components/booking/steps/step-details";
import { StepSchedule } from "@/components/booking/steps/step-schedule";
import { StepSummary } from "@/components/booking/steps/step-summary";
import { StepType } from "@/components/booking/steps/step-type";
import type { OccupiedSlot } from "@/types/availability";
import { getUnavailableSlots } from "@/lib/booking/availability";
import {
  calculateBookingPrice,
  getSessionPeriod,
} from "@/lib/booking/pricing";
import { clearBookingDraft, loadBookingDraft, saveBookingDraft } from "@/lib/booking/storage";
import { validateBookingStep } from "@/lib/booking/validate-step";
import {
  initialBookingFormState,
  type BookingFormState,
  type BookingType,
} from "@/types/booking";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function BookingWizard() {
  const form = useForm<BookingFormState>({
    defaultValues: initialBookingFormState,
  });

  const values = form.watch();
  const [step, setStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [occupiedSlots, setOccupiedSlots] = useState<OccupiedSlot[]>([]);
  const [slotSuggestions, setSlotSuggestions] = useState<
    { date: string; startTime: string; endTime: string; label: string }[]
  >([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    form.reset(loadBookingDraft());
    setHydrated(true);
  }, [form]);

  useEffect(() => {
    if (!hydrated) return;
    saveBookingDraft(values);
  }, [values, hydrated]);

  const fetchAvailability = useCallback(async (date: string) => {
    if (!date) {
      setOccupiedSlots([]);
      return;
    }
    setIsLoadingAvailability(true);
    try {
      const { occupied, error } = await getAvailabilityAction(date);
      if (error) console.warn("[booking] availability:", error);
      setOccupiedSlots(occupied);
    } finally {
      setIsLoadingAvailability(false);
    }
  }, []);

  useEffect(() => {
    if (values.date && step >= 2) {
      void fetchAvailability(values.date);
    }
  }, [values.date, step, fetchAvailability]);

  const updateField = useCallback(
    (field: keyof BookingFormState, value: BookingFormState[keyof BookingFormState]) => {
      form.setValue(field, value, { shouldDirty: true });
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    },
    [form],
  );

  const handleTypeSelect = (type: BookingType) => {
    updateField("bookingType", type);
    if (type === "individual") {
      form.setValue("durationHours", 1);
      form.setValue("playerCount", 1);
    } else {
      form.setValue("playerCount", Math.max(5, form.getValues("playerCount")));
    }
  };

  const handleDateChange = (date: string) => {
    updateField("date", date);
    updateField("startTime", "");
  };

  const handleDurationChange = (hours: number) => {
    updateField("durationHours", hours);
    if (values.date && values.startTime) {
      const unavailable = getUnavailableSlots(values.date, hours, occupiedSlots);
      if (unavailable.has(values.startTime)) {
        updateField("startTime", "");
      }
    }
  };

  const goNext = async () => {
    setFieldErrors({});
    setSubmitError(null);

    const currentValues = form.getValues();
    const validation = validateBookingStep(step, currentValues);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }

    if (step === 2 && currentValues.date && currentValues.startTime) {
      const unavailable = getUnavailableSlots(
        currentValues.date,
        currentValues.durationHours,
        occupiedSlots,
      );
      if (unavailable.has(currentValues.startTime)) {
        setFieldErrors({
          startTime: "This slot is no longer available. Please choose another.",
        });
        return;
      }
      updateField("sessionPeriod", getSessionPeriod(currentValues.startTime));
    }

    if (step === 5) {
      await handleSubmit();
      return;
    }

    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setFieldErrors({});
    setSubmitError(null);
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    const currentValues = form.getValues();
    if (!currentValues.bookingType) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const priceUgx = calculateBookingPrice({
      bookingType: currentValues.bookingType,
      durationHours: currentValues.durationHours,
      playerCount: currentValues.playerCount,
    });

    const payload = {
      bookingType: currentValues.bookingType,
      date: currentValues.date,
      startTime: currentValues.startTime,
      durationHours: currentValues.durationHours,
      sessionPeriod: getSessionPeriod(currentValues.startTime),
      fullName: currentValues.fullName,
      phone: currentValues.phone,
      email: currentValues.email,
      whatsapp: currentValues.whatsapp || undefined,
      preferredContact: currentValues.preferredContact,
      playerCount: currentValues.playerCount,
      skillLevel: currentValues.skillLevel || undefined,
      teamName: currentValues.teamName || undefined,
      matchType: currentValues.matchType || undefined,
      notes: currentValues.notes || undefined,
      termsAccepted: currentValues.termsAccepted as true,
      priceUgx,
    };

    const result = await submitBookingAction(payload);

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      if (result.suggestions) {
        setSlotSuggestions(result.suggestions);
        setStep(2);
        setFieldErrors({
          startTime: result.error,
        });
      }
      if (result.fieldErrors) {
        const flat: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(result.fieldErrors)) {
          flat[k] = msgs[0] ?? "Invalid";
        }
        setFieldErrors(flat);
      }
      return;
    }

    clearBookingDraft();
    setStep(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--landing-green)]" />
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="mx-auto w-full max-w-4xl space-y-8 pb-12 pt-4 sm:space-y-10 sm:pt-8">
      {step < 6 && <BookingStepper currentStep={step} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 1 && (
            <StepType
              value={values.bookingType}
              onSelect={handleTypeSelect}
              error={fieldErrors.bookingType}
            />
          )}

          {step === 2 && values.bookingType && (
            <StepSchedule
              bookingType={values.bookingType}
              date={values.date}
              startTime={values.startTime}
              durationHours={values.durationHours}
              playerCount={values.playerCount}
              occupiedSlots={occupiedSlots}
              isLoadingAvailability={isLoadingAvailability}
              onDateChange={handleDateChange}
              onStartTimeChange={(t) => updateField("startTime", t)}
              onDurationChange={handleDurationChange}
              errors={fieldErrors}
              suggestions={slotSuggestions}
            />
          )}

          {step === 3 && (
            <StepCustomer
              fullName={values.fullName}
              phone={values.phone}
              email={values.email}
              whatsapp={values.whatsapp}
              preferredContact={values.preferredContact}
              onChange={(field, value) =>
                updateField(field as keyof BookingFormState, value)
              }
              errors={fieldErrors}
            />
          )}

          {step === 4 && values.bookingType && (
            <StepDetails
              bookingType={values.bookingType}
              playerCount={values.playerCount}
              skillLevel={values.skillLevel}
              teamName={values.teamName}
              matchType={values.matchType}
              notes={values.notes}
              onChange={(field, value) =>
                updateField(field as keyof BookingFormState, value)
              }
              errors={fieldErrors}
            />
          )}

          {step === 5 && (
            <StepSummary
              values={values}
              termsAccepted={values.termsAccepted}
              onTermsChange={(accepted) => updateField("termsAccepted", accepted)}
              errors={fieldErrors}
              submitError={submitError ?? undefined}
            />
          )}

          {step === 6 && <StepConfirmation />}
        </motion.div>
      </AnimatePresence>

      {step < 6 && (
        <BookingNavigation
          showBack={step > 1}
          onBack={step > 1 ? goBack : undefined}
          onNext={goNext}
          nextLabel={
            step === 1
              ? "Continue"
              : step === 5
                ? "Submit Booking"
                : "Continue"
          }
          isLoading={isSubmitting}
          isNextDisabled={step === 1 && !values.bookingType}
        />
      )}
      </div>
    </FormProvider>
  );
}
