"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOptions, SortOption } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ALL_LOCATIONS, PRICE_STEP, AREA_STEP } from "@/lib/constants";
import {
  formatIndianPrice,
  formatIndianNumber,
} from "@/lib/utils/number-format";

interface SearchFiltersProps {
  locations: string[];
  onFiltersChange: (filters: FilterOptions) => void;
  maxPrice: number;
  maxArea: number;
  initialLocation?: string;
}

export function SearchFilters({
  locations,
  onFiltersChange,
  maxPrice,
  maxArea,
  initialLocation = ALL_LOCATIONS,
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, maxPrice],
    areaRange: [0, maxArea],
    location: initialLocation,
    searchQuery: "",
    sortBy: "price-asc",
  });

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <Card className="p-6 mb-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Search and Sort - Full width on mobile */}
        <div className="md:col-span-2 lg:col-span-3">
          <Label>Search</Label>
          <Input
            type="text"
            placeholder="Search by title, location, or description..."
            className="mt-1"
            onChange={(e) =>
              handleFilterChange({ searchQuery: e.target.value })
            }
          />
        </div>

        {/* Sort Dropdown */}
        <div>
          <Label>Sort By</Label>
          <Select
            defaultValue="price-asc"
            onValueChange={(value) =>
              handleFilterChange({ sortBy: value as SortOption })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="area-asc">Guests: Low to High</SelectItem>
              <SelectItem value="area-desc">Guests: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Dropdown */}
        <div>
          <Label>Location</Label>
          <Select
            defaultValue={initialLocation}
            onValueChange={(value) => handleFilterChange({ location: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_LOCATIONS}>All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Slider */}
        <div className="md:col-span-2 lg:col-span-1">
          <Label>Price Range</Label>
          <div className="mt-2 px-2">
            <Slider
              defaultValue={[0, maxPrice]}
              max={maxPrice}
              step={PRICE_STEP}
              className="mt-3"
              onValueChange={(value) =>
                handleFilterChange({ priceRange: value as [number, number] })
              }
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{formatIndianPrice(filters.priceRange[0])}</span>
              <span>{formatIndianPrice(filters.priceRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Area Range Slider */}
        <div className="md:col-span-2 lg:col-span-1">
          <Label>Guests Range</Label>
          <div className="mt-2 px-2">
            <Slider
              defaultValue={[0, maxArea]}
              max={maxArea}
              step={AREA_STEP}
              className="mt-3"
              onValueChange={(value) =>
                handleFilterChange({ areaRange: value as [number, number] })
              }
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{formatIndianNumber(filters.areaRange[0])} min</span>
              <span>{formatIndianNumber(filters.areaRange[1])} max</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
