"use client";

import { useState } from "react";
import { TripPlanner } from "@/components/trip-planner";
import { plots } from "@/lib/data/plots";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { convertPriceToNumber } from "@/lib/utils/filters";
import { formatIndianPrice } from "@/lib/utils/number-format";

export default function Home() {
  const [filteredPlots, setFilteredPlots] = useState(plots);

  const handleSearch = (filters: {
    location?: string;
    guest: { adults: number; children: number; pets: number };
  }) => {
    let result = [...plots];

    // Filter by Location
    if (filters.location && filters.location !== "all") {
      result = result.filter((p) => p.location === filters.location);
    }

    // Filter by Guests
    const totalGuests = filters.guest.adults + filters.guest.children;
    if (totalGuests > 0) {
      result = result.filter((p) => {
        const capacity = parseInt(p.guests, 10) || 0;
        return capacity >= totalGuests;
      });
    }

    setFilteredPlots(result);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Planner Component */}
        <div className="flex justify-center mb-8 sticky top-4 z-40">
          <TripPlanner onSearch={handleSearch} />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {filteredPlots.length === 0 ? "No homestays found" : "Available Homestays"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredPlots.map((plot) => (
              <Link
                href={`/${plot.slug}-${plot.area
                  .toLowerCase()
                  .replace(/ /g, "-")}`}
                key={plot.id}
                className="group block"
              >
                <div className="relative aspect-[20/19] overflow-hidden rounded-xl bg-gray-200 mb-3">
                  <Image
                    src={plot.images[0]}
                    alt={plot.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 rounded-full bg-transparent hover:bg-transparent text-white hover:text-white"
                  >
                    <Heart className="h-6 w-6 stroke-[2px] transition-transform active:scale-90" />
                  </Button> */}
                  {plot.host?.isPremier && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                      <span className="text-xs font-semibold text-gray-900">Premier Host</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 truncate pr-2">{plot.title}</h3>
                    {/* <div className="flex items-center gap-1 text-sm">
                                            <span className="text-black">★</span>
                                            <span>4.9</span>
                                        </div> */}
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm truncate">{plot.location}</p>
                    <p className="text-gray-500 text-sm">{plot.guests} guests</p>
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-gray-900">
                      {formatIndianPrice(convertPriceToNumber(plot.price))}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">night</span>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-full text-center text-gray-400 py-10">
        Map and more listings coming soon...
      </div>
    </div>
  );
}
