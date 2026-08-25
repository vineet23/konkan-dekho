"use client";

import { EXPERIENCE_CATEGORY_LIST } from "@/lib/data/experience-categories";
import { ExperienceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ExperienceCategoryIcon } from "./experience-category-icon";

interface ExperienceCategoryFiltersProps {
  selected: ExperienceCategory | null;
  onChange: (category: ExperienceCategory | null) => void;
  className?: string;
}

export function ExperienceCategoryFilters({
  selected,
  onChange,
  className,
}: ExperienceCategoryFiltersProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
          selected === null
            ? "border-gray-900 bg-gray-900 text-white"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
        )}
      >
        All
      </button>
      {EXPERIENCE_CATEGORY_LIST.map(([key, { label }]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(selected === key ? null : key)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            selected === key
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
          )}
        >
          <ExperienceCategoryIcon category={key} className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
