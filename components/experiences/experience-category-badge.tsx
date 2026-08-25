import { EXPERIENCE_CATEGORIES } from "@/lib/data/experience-categories";
import { ExperienceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ExperienceCategoryIcon } from "./experience-category-icon";

interface ExperienceCategoryBadgeProps {
  category: ExperienceCategory;
  className?: string;
  showLabel?: boolean;
}

export function ExperienceCategoryBadge({
  category,
  className,
  showLabel = true,
}: ExperienceCategoryBadgeProps) {
  const { label } = EXPERIENCE_CATEGORIES[category];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-800 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <ExperienceCategoryIcon category={category} className="h-3 w-3" />
      {showLabel && label}
    </span>
  );
}
