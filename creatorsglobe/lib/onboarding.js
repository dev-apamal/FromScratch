import { z } from "zod";

export const CREATOR_ROLE_OPTIONS = [
  "DIRECTOR",
  "CINEMATOGRAPHER",
  "EDITOR",
  "PHOTOGRAPHER",
  "PRODUCER",
  "WRITER",
  "SOUND_DESIGNER",
  "COLORIST",
  "ANIMATOR",
  "MAKEUP_ARTIST",
  "STYLIST",
  "OTHER",
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
];

export const AVAILABILITY_STATUS_OPTIONS = [
  "AVAILABLE",
  "UNAVAILABLE",
  "TENTATIVE",
];

export const creatorOnboardingSchema = z
  .object({
    headline: z.string().trim().max(120).optional().or(z.literal("")),
    bio: z.string().trim().min(40, "Bio must be at least 40 characters.").max(1200),
    city: z.string().trim().min(2, "City is required.").max(120),
    latitude: z.coerce
      .number()
      .min(-90, "Latitude must be between -90 and 90.")
      .max(90, "Latitude must be between -90 and 90."),
    longitude: z.coerce
      .number()
      .min(-180, "Longitude must be between -180 and 180.")
      .max(180, "Longitude must be between -180 and 180."),
    roles: z
      .array(z.enum(CREATOR_ROLE_OPTIONS))
      .min(1, "Select at least one role.")
      .max(4, "Select up to four roles."),
    experienceLevel: z.enum(EXPERIENCE_LEVEL_OPTIONS),
    availabilityStatus: z.enum(AVAILABILITY_STATUS_OPTIONS),
    budgetMin: z.coerce
      .number()
      .int("Minimum budget must be a whole number.")
      .min(0, "Minimum budget cannot be negative."),
    budgetMax: z.coerce
      .number()
      .int("Maximum budget must be a whole number.")
      .min(0, "Maximum budget cannot be negative."),
  })
  .refine((value) => value.budgetMax >= value.budgetMin, {
    message: "Maximum budget must be greater than or equal to minimum budget.",
    path: ["budgetMax"],
  });
