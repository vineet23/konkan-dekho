import { Plot, FilterOptions } from "@/lib/types";
import { ALL_LOCATIONS } from "@/lib/constants";

export function convertPriceToNumber(price: string): number {
  return parseInt(price.replace(/[^\d]/g, ""));
}

export function convertAreaToNumber(area: string): number {
  return parseInt(area.replace(/[^\d]/g, ""));
}

export function filterPlots(plots: Plot[], filters: FilterOptions): Plot[] {
  return plots.filter((plot) => {
    const price = convertPriceToNumber(plot.price);
    const area = convertAreaToNumber(plot.guests);
    const matchesPrice =
      price >= filters.priceRange[0] && price <= filters.priceRange[1];
    const matchesArea =
      area >= filters.areaRange[0] && area <= filters.areaRange[1];
    const matchesLocation =
      filters.location === ALL_LOCATIONS ||
      plot.location.toLowerCase() === filters.location.toLowerCase();
    const matchesSearch =
      !filters.searchQuery ||
      plot.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      plot.location.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      plot.description
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase());

    return matchesPrice && matchesArea && matchesLocation && matchesSearch;
  });
}
