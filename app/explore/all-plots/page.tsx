"use client";

import { plots } from "@/lib/data/plots";
import { SearchFilters } from "@/components/plots/search-filters";
import { PlotGrid } from "@/components/plots/plot-grid";
import { useState } from "react";
import { FilterOptions, Plot } from "@/lib/types";
import { filterPlots } from "@/lib/utils/filters";
import { sortPlots } from "@/lib/utils/sorting";
import { convertPriceToNumber, convertAreaToNumber } from "@/lib/utils/filters";

export default function AllPlotsPage() {
  const [filteredPlots, setFilteredPlots] = useState<Plot[]>(plots);
  
  const locations = Array.from(new Set(plots.map(plot => plot.location)));
  const maxPrice = Math.max(...plots.map(plot => convertPriceToNumber(plot.price)));
  const maxArea = Math.max(...plots.map(plot => convertAreaToNumber(plot.area)));

  const handleFiltersChange = (filters: FilterOptions) => {
    const filtered = filterPlots(plots, filters);
    const sorted = sortPlots(filtered, filters.sortBy);
    setFilteredPlots(sorted);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">All Available Plots</h1>
      
      <SearchFilters
        locations={locations}
        onFiltersChange={handleFiltersChange}
        maxPrice={maxPrice}
        maxArea={maxArea}
      />

      <PlotGrid plots={filteredPlots} />
    </div>
  );
}