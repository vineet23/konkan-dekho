"use client";

import Image from "next/image";
import Link from "next/link";
import { plots } from "@/lib/data/plots";
import { useMemo } from "react";
import { MapPin } from "lucide-react";

export default function FeaturedLocationsPage() {
  const featuredLocations = useMemo(() => {
    // Get unique locations
    const locations = Array.from(
      new Set(plots.map((p) => p.location).filter(Boolean)),
    );

    // Create location objects with count
    return locations.map((location) => {
      const count = plots.filter((p) => p.location === location).length;
      let image =
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef";

      switch (location) {
        case "Ratnagiri":
          image =
            "https://firebasestorage.googleapis.com/v0/b/konkandekho-158ab.firebasestorage.app/o/Locations%2Fratnagiri.webp.webp?alt=media&token=d2f39023-b6e7-45d7-9280-56b16e07a610";
          break;
        case "Guhagar":
          image =
            "https://firebasestorage.googleapis.com/v0/b/konkandekho-158ab.firebasestorage.app/o/Locations%2Fguhagar.webp.webp?alt=media&token=8b9c14a7-a295-450e-98e2-ff4372379cab";
          break;
        case "Malvan":
          image =
            "https://firebasestorage.googleapis.com/v0/b/konkandekho-158ab.firebasestorage.app/o/Locations%2Fmalvan.webp.webp?alt=media&token=084ece1e-f598-4c10-abcb-d5694ffa3239";
          break;
        case "Vengurla":
          image =
            "https://firebasestorage.googleapis.com/v0/b/konkandekho-158ab.firebasestorage.app/o/Locations%2Fvengurla.webp.webp?alt=media&token=ef3747c6-9d18-45e2-848a-29d023cb593e";
          break;
      }

      return {
        name: location,
        image,
        plotCount: count,
      };
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-caveat font-bold mb-8">
        Featured Locations
      </h1>
      <p className="text-gray-600 mb-12 max-w-3xl">
        Discover our handpicked selection of prime locations in the Konkan
        region, each offering unique investment opportunities and natural
        beauty.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {featuredLocations.map((location) => (
          <Link
            href={`/explore/featured-locations/${encodeURIComponent(location.name)}`}
            key={location.name}
            className="group block"
          >
            <div className="relative aspect-[20/19] overflow-hidden rounded-xl bg-gray-200 mb-3">
              <Image
                src={location.image}
                alt={location.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900 truncate pr-2">
                  {location.name}
                </h3>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="h-4 w-4 mr-1 text-[#FF385C]" />
                {location.plotCount} homestays available
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
