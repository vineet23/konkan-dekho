import { z } from "zod";
import {
  httpOrPathUrlSchema,
  optionalLatitudeSchema,
  optionalLongitudeSchema,
  optionalPhoneSchema,
  rateSchema,
  slugSchema,
} from "./validators";

export const experienceCategorySchema = z.enum([
  "beach",
  "temples",
  "adventure",
  "nature",
  "culture",
  "scenic",
]);

/** Loose — for reading stored JSON */
export const experienceSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  rate: z.union([z.string(), z.number()]),
  guideline: z.string().optional(),
  language: z.union([z.string(), z.array(z.string())]),
  photos: z.array(z.string()),
  location: z.string(),
  phone: z.string(),
  category: experienceCategorySchema,
  coordinates: z
    .object({
      latitude: z.string(),
      longitude: z.string(),
    })
    .optional(),
});

export const experiencesArraySchema = z.array(experienceSchema);

export type ExperienceCategory = z.infer<typeof experienceCategorySchema>;
export type Experience = z.infer<typeof experienceSchema>;

/** Strict schema for admin create/update */
export const experienceAdminObjectSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  slug: slugSchema,
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters"),
  rate: rateSchema,
  guideline: z.string().optional(),
  language: z.union([
    z.string(),
    z.array(z.string()).min(1, "Add at least one language"),
  ]),
  photos: z.array(httpOrPathUrlSchema).min(1, "Add at least one photo"),
  location: z.string().trim().min(1, "Location is required"),
  phone: optionalPhoneSchema,
  category: experienceCategorySchema,
  coordinates: z
    .object({
      latitude: optionalLatitudeSchema,
      longitude: optionalLongitudeSchema,
    })
    .optional(),
});

function refineExperienceAdmin(
  data: z.infer<typeof experienceAdminObjectSchema> | Omit<
    z.infer<typeof experienceAdminObjectSchema>,
    "id"
  >,
  ctx: z.RefinementCtx
) {
  const languages = Array.isArray(data.language)
    ? data.language.filter((l) => l.trim())
    : data.language.trim()
      ? [data.language]
      : [];
  if (languages.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Add at least one language",
      path: ["language"],
    });
  }

  const lat = data.coordinates?.latitude?.trim();
  const lng = data.coordinates?.longitude?.trim();
  if ((lat && !lng) || (!lat && lng)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Provide both latitude and longitude, or leave both blank",
      path: ["coordinates", "latitude"],
    });
  }
}

export const experienceAdminSchema =
  experienceAdminObjectSchema.superRefine(refineExperienceAdmin);

export const experienceAdminCreateSchema = experienceAdminObjectSchema
  .omit({ id: true })
  .superRefine(refineExperienceAdmin);

export type ExperienceAdmin = z.infer<typeof experienceAdminSchema>;
export type ExperienceAdminCreate = z.infer<typeof experienceAdminCreateSchema>;
