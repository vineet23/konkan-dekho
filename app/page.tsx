"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { plots } from "@/lib/data/plots";
import { CollapsibleSearchFilters } from "@/components/plots/collapsible-search-filters";
import { filterPlots } from "@/lib/utils/filters";
import { sortPlots } from "@/lib/utils/sorting";
import { FilterOptions, Plot } from "@/lib/types";
import { convertPriceToNumber, convertAreaToNumber } from "@/lib/utils/filters";
import { formatIndianPrice } from "@/lib/utils/number-format";

export default function Home() {
  const [filteredPlots, setFilteredPlots] = useState<Plot[]>(plots);

  const locations = Array.from(new Set(plots.map((plot) => plot.location)));
  const maxPrice = Math.max(
    ...plots.map((plot) => convertPriceToNumber(plot.price))
  );
  const maxArea = Math.max(
    ...plots.map((plot) => convertAreaToNumber(plot.area))
  );

  const handleFiltersChange = (filters: FilterOptions) => {
    const filtered = filterPlots(plots, filters);
    const sorted = sortPlots(filtered, filters.sortBy);
    setFilteredPlots(sorted);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1667807876919-3a493bd565a3"
            alt="Konkan landscape"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Find Your Perfect Plot & Homestay in Konkan
            </h1>
            <p className="mt-4 text-xl">
              Explore premium land plots & homestays with breathtaking views and
              excellent investment potential.
            </p>
            <Link href="/explore/all-plots">
              <Button className="mt-8 bg-[#FF385C] hover:bg-[#D93B60]">
                Explore Homestays
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CollapsibleSearchFilters
            locations={locations}
            onFiltersChange={handleFiltersChange}
            maxPrice={maxPrice}
            maxArea={maxArea}
          />

          <h2 className="pt-8 text-4xl font-bold font-caveat mb-8">
            {filteredPlots.length === 0
              ? "No homestays found"
              : "Available Homestays"}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlots.map((plot) => (
              <Link href={`/plots/${plot.id}`} key={plot.id}>
                <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
                  <div className="relative h-48">
                    <Image
                      src={plot.images[0]}
                      alt={plot.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{plot.title}</h3>
                    <div className="mt-2 flex items-center text-gray-600">
                      <MapPin className="mr-1 h-4 w-4" />
                      {plot.location}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{plot.area}</p>
                        <p className="text-lg font-bold text-[#FF385C]">
                          {formatIndianPrice(convertPriceToNumber(plot.price))}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
