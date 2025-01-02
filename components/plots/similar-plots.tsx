"use client";

import { Plot } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { parseCoordinates, calculateDistance } from "@/lib/utils/geo-distance";
import { convertPriceToNumber } from "@/lib/utils/filters";
import { formatIndianPrice } from "@/lib/utils/number-format";

interface SimilarPlotsProps {
  currentPlot: Plot;
  allPlots: Plot[];
}

export function SimilarPlots({ currentPlot, allPlots }: SimilarPlotsProps) {
  const getSimilarPlots = () => {
    const currentLat = parseCoordinates(currentPlot.coordinates.latitude);
    const currentLon = parseCoordinates(currentPlot.coordinates.longitude);

    return allPlots
      .filter((plot) => plot.id !== currentPlot.id)
      .map((plot) => ({
        ...plot,
        distance: calculateDistance(
          currentLat,
          currentLon,
          parseCoordinates(plot.coordinates.latitude),
          parseCoordinates(plot.coordinates.longitude)
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  };

  const similarPlots = getSimilarPlots();

  if (similarPlots.length === 0) return null;

  return (
    <div className="mt-12 border-t">
      <h2 className="pt-8 text-3xl font-bold mb-6 font-caveat">
        Similar Plots Near by
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {similarPlots.map((plot) => (
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
                  <span>{plot.location}</span>
                  <span className="ml-2 text-sm">
                    ({Math.round(plot.distance * 10) / 10} km away)
                  </span>
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
  );
}
