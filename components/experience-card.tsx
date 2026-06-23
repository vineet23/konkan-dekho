"use client";

import Link from "next/link";
import Image from "next/image";
import { Experience } from "@/lib/types";

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Link
      href={`/experiences/${experience.slug}`}
      className="group block"
    >
      <div className="relative aspect-[20/19] overflow-hidden rounded-xl bg-gray-200 mb-3">
        {experience.photos && experience.photos.length > 0 ? (
          <Image
            src={experience.photos[0]}
            alt={experience.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate pr-2">
            {experience.name}
          </h3>
        </div>
        <div>
          <p className="text-gray-500 text-sm truncate">
            {experience.location}
          </p>
          <p className="text-gray-500 text-sm truncate">
            Language: {Array.isArray(experience.language) ? experience.language.join(', ') : experience.language}
          </p>
        </div>
        <div className="text-left mt-1">
          <span className="text-sm sm:text-base font-semibold text-gray-900">
            {experience.rate}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm ml-1">per person</span>
        </div>
      </div>
    </Link>
  );
}
