import { Plot, SortOption } from "@/lib/types";
import { convertPriceToNumber, convertAreaToNumber } from "./filters";

export function sortPlots(plots: Plot[], sortBy: SortOption): Plot[] {
  const sortedPlots = [...plots];

  switch (sortBy) {
    case 'price-asc':
      return sortedPlots.sort((a, b) => 
        convertPriceToNumber(a.price) - convertPriceToNumber(b.price)
      );
    case 'price-desc':
      return sortedPlots.sort((a, b) => 
        convertPriceToNumber(b.price) - convertPriceToNumber(a.price)
      );
    case 'area-asc':
      return sortedPlots.sort((a, b) => 
        convertAreaToNumber(a.area) - convertAreaToNumber(b.area)
      );
    case 'area-desc':
      return sortedPlots.sort((a, b) => 
        convertAreaToNumber(b.area) - convertAreaToNumber(a.area)
      );
    default:
      return sortedPlots;
  }
}