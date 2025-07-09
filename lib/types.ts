export type SortOption = "price-asc" | "price-desc" | "area-asc" | "area-desc";

export interface FilterOptions {
  priceRange: [number, number];
  areaRange: [number, number];
  location: string;
  searchQuery: string;
  sortBy: SortOption;
}

export interface PlotMedia {
  type: "image" | "video";
  url: string;
  thumbnail?: string; // Thumbnail for videos
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
  media: PlotMedia[];
  googleMapsUrl: string; // ✅ instead of coordinates
}


// Define the TeamMember type
export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  email?: string;
  bio: string;
}

export interface Review {
  id: string;
  name: string;
  comment: string;
  media?: { type: "image" | "video"; url: string }[];
  date: string;
}

