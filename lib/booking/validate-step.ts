import type { BookingFormState } from "@/types/booking";
import type { ZodIssue } from "zod";
import {
  stepCustomerSchema,
  stepIndividualDetailsSchema,
  stepScheduleSchema,
  stepSummarySchema,
  stepTeamDetailsSchema,
  stepTypeSchema,
} from "@/lib/booking/schema";

export type StepValidationResult =
  | { success: true }
  | { success: false; errors: Record<string, string> };

function flattenZodErrors(issues: ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join(".") || "_form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function validateBookingStep(
  step: number,
  values: BookingFormState,
): StepValidationResult {
  switch (step) {
    case 1: {
      const result = stepTypeSchema.safeParse(values);
      if (!result.success) {
        return { success: false, errors: flattenZodErrors(result.error.issues) };
      }
      return { success: true };
    }
    case 2: {
      const result = stepScheduleSchema.safeParse(values);
      if (!result.success) {
        return { success: false, errors: flattenZodErrors(result.error.issues) };
      }
      return { success: true };
    }
    case 3: {
      const result = stepCustomerSchema.safeParse(values);
      if (!result.success) {
        return { success: false, errors: flattenZodErrors(result.error.issues) };
      }
      return { success: true };
    }
    case 4: {
      if (values.bookingType === "team") {
        const result = stepTeamDetailsSchema.safeParse(values);
        if (!result.success) {
          return { success: false, errors: flattenZodErrors(result.error.issues) };
        }
      } else {
        const result = stepIndividualDetailsSchema.safeParse(values);
        if (!result.success) {
          return { success: false, errors: flattenZodErrors(result.error.issues) };
        }
      }
      return { success: true };
    }
    case 5: {
      const result = stepSummarySchema.safeParse(values);
      if (!result.success) {
        return { success: false, errors: flattenZodErrors(result.error.issues) };
      }
      return { success: true };
    }
    default:
      return { success: true };
  }
}
