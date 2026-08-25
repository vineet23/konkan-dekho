import {
  Waves,
  Landmark,
  Zap,
  Trees,
  Palette,
  Sunset,
  type LucideIcon,
} from "lucide-react";
import { ExperienceCategory } from "../types";

export const EXPERIENCE_CATEGORIES: Record<
  ExperienceCategory,
  { label: string; icon: LucideIcon }
> = {
  beach: { label: "Beach", icon: Waves },
  temples: { label: "Temples", icon: Landmark },
  adventure: { label: "Adventure", icon: Zap },
  nature: { label: "Nature", icon: Trees },
  culture: { label: "Culture", icon: Palette },
  scenic: { label: "Scenic", icon: Sunset },
};

export const EXPERIENCE_CATEGORY_LIST = Object.entries(
  EXPERIENCE_CATEGORIES
) as [ExperienceCategory, (typeof EXPERIENCE_CATEGORIES)[ExperienceCategory]][];
