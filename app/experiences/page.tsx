"use client";

import { experiences } from "@/lib/data/experiences";
import { ExperienceCard } from "@/components/experience-card";

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mt-6">
          <h2 className="text-4xl font-bold font-caveat mb-8">
            {experiences.length === 0
              ? "No experiences found"
              : "Local Experiences"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
