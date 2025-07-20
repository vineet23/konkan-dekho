"use client";

import { plots } from "@/lib/data/plots";
import { CollapsibleSearchFilters } from "@/components/plots/collapsible-search-filters";
import { PlotGrid } from "@/components/plots/plot-grid";
import { useState, useEffect } from "react";
import { FilterOptions, Plot } from "@/lib/types";
import { filterPlots } from "@/lib/utils/filters";
import { sortPlots } from "@/lib/utils/sorting";
import { convertPriceToNumber, convertAreaToNumber } from "@/lib/utils/filters";
import { useSearchParams } from "next/navigation";
import { ALL_LOCATIONS } from "@/lib/constants";

export default function AllPlotsPage() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");

  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [
      0,
      Math.max(...plots.map((plot) => convertPriceToNumber(plot.price))),
    ],
    areaRange: [
      0,
      Math.max(...plots.map((plot) => convertAreaToNumber(plot.guests))),
    ],
    location: locationParam || ALL_LOCATIONS,
    searchQuery: "",
    sortBy: "price-asc",
  });

  const [filteredPlots, setFilteredPlots] = useState<Plot[]>(plots);

  const locations = Array.from(new Set(plots.map((plot) => plot.location)));
  const maxPrice = Math.max(
    ...plots.map((plot) => convertPriceToNumber(plot.price))
  );
  const maxArea = Math.max(
    ...plots.map((plot) => convertAreaToNumber(plot.guests))
  );

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    const filtered = filterPlots(plots, newFilters);
    const sorted = sortPlots(filtered, newFilters.sortBy);
    setFilteredPlots(sorted);
  };

  // Apply initial filters when component mounts
  useEffect(() => {
    const filtered = filterPlots(plots, filters);
    const sorted = sortPlots(filtered, filters.sortBy);
    setFilteredPlots(sorted);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold font-caveat mb-8">
        All Available Homestays
      </h1>

      <CollapsibleSearchFilters
        locations={locations}
        onFiltersChange={handleFiltersChange}
        maxPrice={maxPrice}
        maxArea={maxArea}
        initialLocation={locationParam || ALL_LOCATIONS}
      />

      <PlotGrid plots={filteredPlots} />
    </div>
  );
}
