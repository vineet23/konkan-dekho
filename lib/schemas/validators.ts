import { z } from "zod";

/** Indian-style or international phone: digits with optional +, spaces, dashes */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone is required")
  .refine(
    (v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 8 && digits.length <= 15;
    },
    { message: "Enter a valid phone number (8–15 digits)" }
  );

export const optionalPhoneSchema = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (!v) return true;
      const digits = v.replace(/\D/g, "");
      return digits.length >= 8 && digits.length <= 15;
    },
    { message: "Enter a valid phone number (8–15 digits)" }
  );

export const guestsSchema = z
  .string()
  .trim()
  .min(1, "Guests is required")
  .refine((v) => /^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 100, {
    message: "Guests must be a whole number between 1 and 100",
  });

export const priceSchema = z
  .string()
  .trim()
  .min(1, "Price is required")
  .refine((v) => /\d/.test(v), {
    message: "Price must include a number (e.g. ₹4,000)",
  });

/** Rate can be blank (free), a number, or text that includes a digit / Free */
export const rateSchema = z.union([
  z.number(),
  z
    .string()
    .trim()
    .refine(
      (v) =>
        v === "" ||
        v === " " ||
        /^free$/i.test(v) ||
        /\d/.test(v),
      { message: "Rate should be Free, blank, or include a number" }
    ),
]);

export const httpOrPathUrlSchema = z
  .string()
  .trim()
  .min(1, "URL is required")
  .refine(
    (v) =>
      /^https?:\/\//i.test(v) ||
      v.startsWith("/") ||
      v.startsWith("blob:"),
    { message: "Enter a valid URL (https://… or /path)" }
  );

export const optionalHttpOrPathUrlSchema = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (!v) return true;
      return (
        /^https?:\/\//i.test(v) ||
        v.startsWith("/") ||
        v.startsWith("blob:")
      );
    },
    { message: "Enter a valid URL (https://… or /path)" }
  );

/** Accepts plain numbers or values with ° / N / S / E / W (suffixes optional). */
export function parseCoordinate(raw: string): number | null {
  const cleaned = raw
    .replace(/[°º˚]/g, " ")
    .replace(/[NSEW]/gi, " ")
    .trim();
  const match = cleaned.match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : null;
}

export const latitudeSchema = z
  .string()
  .trim()
  .min(1, "Latitude is required")
  .refine(
    (v) => {
      const n = parseCoordinate(v);
      return n !== null && n >= -90 && n <= 90;
    },
    {
      message:
        "Latitude must be between -90 and 90 (e.g. 17.1045 — ° N optional)",
    }
  );

export const longitudeSchema = z
  .string()
  .trim()
  .min(1, "Longitude is required")
  .refine(
    (v) => {
      const n = parseCoordinate(v);
      return n !== null && n >= -180 && n <= 180;
    },
    {
      message:
        "Longitude must be between -180 and 180 (e.g. 73.2906 — ° E optional)",
    }
  );

export const optionalLatitudeSchema = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (!v) return true;
      const n = parseCoordinate(v);
      return n !== null && n >= -90 && n <= 90;
    },
    {
      message: "Latitude must be between -90 and 90 (e.g. 17.1045 — ° N optional)",
    }
  );

export const optionalLongitudeSchema = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (!v) return true;
      const n = parseCoordinate(v);
      return n !== null && n >= -180 && n <= 180;
    },
    {
      message:
        "Longitude must be between -180 and 180 (e.g. 73.2906 — ° E optional)",
    }
  );

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase letters, numbers, and hyphens",
  });
