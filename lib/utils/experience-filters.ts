import { Experience, ExperienceCategory } from "../types";

export function filterExperiences(
  experiences: Experience[],
  filters: { location?: string; category?: ExperienceCategory | null }
): Experience[] {
  return experiences.filter((e) => {
    const matchesLocation =
      !filters.location ||
      filters.location === "all" ||
      e.location === filters.location;
    const matchesCategory =
      !filters.category || e.category === filters.category;
    return matchesLocation && matchesCategory;
  });
}
