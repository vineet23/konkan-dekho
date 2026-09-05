import { z } from "zod";
import {
  guestsSchema,
  httpOrPathUrlSchema,
  latitudeSchema,
  longitudeSchema,
  optionalHttpOrPathUrlSchema,
  phoneSchema,
  priceSchema,
  slugSchema,
} from "./validators";

/** Loose schemas — tolerate legacy empty placeholders when reading stored JSON */
export const plotMediaSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string(),
  thumbnail: z.string().optional(),
});

export const hostInfoSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
  isPremier: z.boolean().optional(),
  listingDate: z.string().optional(),
});

export const plotSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  slug: z.string().min(1),
  area: z.string().min(1),
  location: z.string().min(1),
  guests: z.string().min(1),
  price: z.string().min(1),
  description: z.string(),
  phone: z.string(),
  features: z.array(z.string()),
  images: z.array(z.string()),
  media: z.array(plotMediaSchema),
  coordinates: z.object({
    latitude: z.string(),
    longitude: z.string(),
  }),
  host: hostInfoSchema.optional(),
  ical: z.array(z.string()).optional(),
});

export const plotsArraySchema = z.array(plotSchema);

export type PlotMedia = z.infer<typeof plotMediaSchema>;
export type HostInfo = z.infer<typeof hostInfoSchema>;
export type Plot = z.infer<typeof plotSchema>;

/** Strict schema for admin create/update */
export const plotMediaAdminSchema = z.object({
  type: z.enum(["image", "video"]),
  url: httpOrPathUrlSchema,
  thumbnail: optionalHttpOrPathUrlSchema,
});

export const hostInfoAdminSchema = z
  .object({
    name: z.string().trim(),
    imageUrl: optionalHttpOrPathUrlSchema,
    isPremier: z.boolean().optional(),
    listingDate: z.string().optional(),
  })
  .superRefine((host, ctx) => {
    const hasAny =
      Boolean(host.name?.trim()) ||
      Boolean(host.imageUrl?.trim()) ||
      Boolean(host.listingDate?.trim());
    if (hasAny && !host.name?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Host name is required when host details are set",
        path: ["name"],
      });
    }
  });

export const plotAdminSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  slug: slugSchema,
  area: z.string().trim().min(1, "Area is required"),
  location: z.string().trim().min(1, "Location is required"),
  guests: guestsSchema,
  price: priceSchema,
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters"),
  phone: phoneSchema,
  features: z.array(z.string()),
  images: z
    .array(httpOrPathUrlSchema)
    .min(1, "Add at least one image"),
  media: z.array(plotMediaAdminSchema),
  coordinates: z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
  }),
  host: hostInfoAdminSchema.optional(),
  ical: z.array(z.string()).optional(),
});

export type PlotAdmin = z.infer<typeof plotAdminSchema>;
