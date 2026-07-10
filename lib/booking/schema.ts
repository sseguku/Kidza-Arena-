import { z } from "zod";

const ugandaPhoneRegex = /^(\+256|256|0)?[7]\d{8}$/;

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .transform((val) => val.replace(/\s/g, ""))
  .refine(
    (val) => ugandaPhoneRegex.test(val.replace(/\s/g, "")),
    "Enter a valid Uganda phone number",
  );

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export const stepTypeSchema = z.object({
  bookingType: z.enum(["individual", "team"], {
    message: "Please select a booking type",
  }),
});

export const stepScheduleSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  startTime: z.string().min(1, "Please select a start time"),
  durationHours: z.number().min(1).max(3),
});

export const stepCustomerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: phoneSchema,
  email: emailSchema,
  whatsapp: z.string().optional(),
  preferredContact: z.enum(["phone", "email", "whatsapp"]),
});

export const stepIndividualDetailsSchema = z.object({
  playerCount: z.number().min(1, "At least 1 player").max(30),
  skillLevel: z.enum(["beginner", "intermediate", "advanced", "any", ""]).optional(),
  notes: z.string().max(1000).optional(),
});

export const stepTeamDetailsSchema = z.object({
  teamName: z.string().min(2, "Team name is required"),
  playerCount: z.number().min(5, "Minimum 5 players for team booking").max(30),
  matchType: z.enum([
    "friendly",
    "training",
    "tournament",
    "corporate_event",
    "birthday_party",
  ], { message: "Please select a match type" }),
  notes: z.string().max(1000).optional(),
});

export const stepSummarySchema = z.object({
  termsAccepted: z.literal(true, {
    message: "You must accept the terms and conditions",
  }),
});

export const submitBookingSchema = z
  .object({
    bookingType: z.enum(["individual", "team"]),
    date: z.string().min(1),
    startTime: z.string().min(1),
    durationHours: z.number().min(1).max(3),
    sessionPeriod: z.enum(["day", "night"]),
    fullName: z.string().min(2),
    phone: phoneSchema,
    email: emailSchema,
    whatsapp: z.string().optional(),
    preferredContact: z.enum(["phone", "email", "whatsapp"]).optional(),
    playerCount: z.number().min(1).max(30),
    skillLevel: z.string().optional(),
    teamName: z.string().optional(),
    matchType: z.string().optional(),
    notes: z.string().optional(),
    termsAccepted: z.literal(true),
    priceUgx: z.number().positive(),
  })
  .superRefine((data, ctx) => {
    if (data.bookingType === "team") {
      if (!data.teamName || data.teamName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Team name is required",
          path: ["teamName"],
        });
      }
      if (!data.matchType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Match type is required",
          path: ["matchType"],
        });
      }
    }
  });

export type SubmitBookingInput = z.infer<typeof submitBookingSchema>;
