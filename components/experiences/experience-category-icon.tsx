import { EXPERIENCE_CATEGORIES } from "@/lib/data/experience-categories";
import { ExperienceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExperienceCategoryIconProps {
  category: ExperienceCategory;
  className?: string;
}

export function ExperienceCategoryIcon({
  category,
  className,
}: ExperienceCategoryIconProps) {
  const Icon = EXPERIENCE_CATEGORIES[category].icon;
  return <Icon className={cn("h-4 w-4", className)} />;
}
