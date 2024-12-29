import { type ClassValue } from "clsx";

export type SortOption = 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc';

export interface FilterOptions {
  priceRange: [number, number];
  areaRange: [number, number];
  location: string;
  searchQuery: string;
  sortBy: SortOption;
}

export interface Plot {
  id: number;
  title: string;
  location: string;
  area: string;
  price: string;
  description: string;
  features: string[];
  images: string[];
  coordinates: {
    latitude: string;
    longitude: string;
  };
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  email: string;
  bio: string;
}