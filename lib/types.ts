export type SortOption = 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc';

export interface FilterOptions {
  priceRange: [number, number];
  areaRange: [number, number];
  location: string;
  searchQuery: string;
  sortBy: SortOption;
}