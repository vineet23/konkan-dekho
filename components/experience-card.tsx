"use client";

import Link from "next/link";
import { Experience } from "@/lib/types";
import { CardImageSlider } from "@/components/ui/card-image-slider";
import { ExperienceCategoryBadge } from "@/components/experiences/experience-category-badge";

interface ExperienceCardProps {
  experience: Experience;
  distance?: number;
  compact?: boolean;
  minimal?: boolean;
}

export function ExperienceCard({
  experience,
  distance,
  compact = false,
  minimal = false,
}: ExperienceCardProps) {
  return (
    <Link
      href={`/experiences/${experience.slug}`}
      className="group flex h-full flex-col"
    >
      <div className="relative mb-3 aspect-[20/19] overflow-hidden rounded-xl bg-gray-200">
        <CardImageSlider images={experience.photos || []} alt={experience.name} />
        <div className="absolute left-2 top-2 z-10">
          <ExperienceCategoryBadge category={experience.category} />
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="truncate pr-2 text-sm font-semibold text-gray-900 sm:text-base">
            {experience.name}
          </h3>
        </div>
        {!minimal && (
          <>
            <div>
              <p className="truncate text-sm text-gray-500">
                {experience.location}
                {distance !== undefined && (
                  <span className="ml-1">
                    ({Math.round(distance * 10) / 10} km away)
                  </span>
                )}
              </p>
              <p className="truncate text-sm text-gray-500">
                {compact
                  ? Array.isArray(experience.language)
                    ? experience.language.join(", ")
                    : experience.language
                  : `Language: ${
                      Array.isArray(experience.language)
                        ? experience.language.join(", ")
                        : experience.language
                    }`}
              </p>
            </div>
            <div className="text-left">
              {experience.rate && String(experience.rate).trim() ? (
                <>
                  <span className="text-sm font-semibold text-gray-900 sm:text-base">
                    {experience.rate}
                  </span>
                  <span className="ml-1 text-xs text-gray-500 sm:text-sm">
                    per person
                  </span>
                </>
              ) : compact ? (
                <span className="text-sm text-gray-500">Experience</span>
              ) : null}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
