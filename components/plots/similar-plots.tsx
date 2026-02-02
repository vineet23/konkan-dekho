"use client";

import { Plot } from "@/lib/types";
import { HomestayCard } from "@/components/homestay-card";
import { parseCoordinates, calculateDistance } from "@/lib/utils/geo-distance";

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
        Similar homestays near by
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {similarPlots.map((plot) => (
          <HomestayCard key={plot.id} plot={plot} distance={plot.distance} />
        ))}
      </div>
    </div>
  );
}
