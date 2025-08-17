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

export interface HostInfo {
  name: string;
  imageUrl: string;
  isPremier?: boolean;
  listingDate?: string; // Date when the host started listing
  // yearsHosting?: number;
}

export interface Plot {
  id: number;
  title: string;
  location: string;
  guests: string;
  price: string;
  description: string;
  phone: string;
  features: string[];
  images: string[];
  media: PlotMedia[];
  coordinates: {
    latitude: string;
    longitude: string;
  };
  host?: HostInfo;
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
