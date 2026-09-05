export type {
  Plot,
  PlotMedia,
  HostInfo,
  Experience,
  ExperienceCategory,
} from "./schemas";

export type SortOption = "price-asc" | "price-desc" | "area-asc" | "area-desc";

export interface FilterOptions {
  priceRange: [number, number];
  areaRange: [number, number];
  location: string;
  searchQuery: string;
  sortBy: SortOption;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  email?: string;
  bio: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  images: string[];
  body: string;
}
