/** Shared slug helper for admin forms and public URLs. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type PlotSlugRef = { id: number; slug: string; area: string };
export type ExperienceSlugRef = { id: number; slug: string };

/** Plot slugs must be unique across all areas (simpler admin UX). */
export function findPlotSlugConflict(
  existingPlots: PlotSlugRef[],
  slug: string,
  excludeId: number
): PlotSlugRef | undefined {
  const s = slug.trim().toLowerCase();
  if (!s) return undefined;
  return existingPlots.find(
    (p) => p.id !== excludeId && p.slug.toLowerCase() === s
  );
}

export function isPlotSlugTaken(
  existingPlots: PlotSlugRef[],
  slug: string,
  excludeId: number
): boolean {
  return Boolean(findPlotSlugConflict(existingPlots, slug, excludeId));
}

export function isExperienceSlugTaken(
  existing: ExperienceSlugRef[],
  slug: string,
  excludeId: number
): boolean {
  const s = slug.trim().toLowerCase();
  if (!s) return false;
  return existing.some(
    (e) => e.id !== excludeId && e.slug.toLowerCase() === s
  );
}
