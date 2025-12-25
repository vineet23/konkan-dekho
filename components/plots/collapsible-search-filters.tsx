"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "./search-filters";
import { FilterOptions } from "@/lib/types";

interface CollapsibleSearchFiltersProps {
  locations: string[];
  onFiltersChange: (filters: FilterOptions) => void;
  maxPrice: number;
  maxArea: number;
  initialLocation?: string;
  isHomePage?: boolean;
}

export function CollapsibleSearchFilters(props: CollapsibleSearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="md:block">
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        className="w-full mb-4 flex items-center justify-between md:hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Search & Filters</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
      </Button>

      {/* Filters Content */}
      <div className={`${isExpanded ? "block" : "hidden"} md:block`}>
        <SearchFilters {...props} />
      </div>
    </div>
  );
}
