"use client";

import { useMemo, useState } from "react";
import { experiences } from "@/lib/data/experiences";
import { ExperienceCard } from "@/components/experience-card";
import { ExperienceCategoryFilters } from "@/components/experiences/experience-category-filters";
import { filterExperiences } from "@/lib/utils/experience-filters";
import { ExperienceCategory } from "@/lib/types";

export default function ExperiencesPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<ExperienceCategory | null>(null);

  const filteredExperiences = useMemo(
    () => filterExperiences(experiences, { category: selectedCategory }),
    [selectedCategory]
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mt-6">
          <h2 className="text-4xl font-bold font-caveat mb-6">
            {filteredExperiences.length === 0
              ? "No experiences found"
              : "Local Experiences"}
          </h2>
          <ExperienceCategoryFilters
            selected={selectedCategory}
            onChange={setSelectedCategory}
            className="mb-8"
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
