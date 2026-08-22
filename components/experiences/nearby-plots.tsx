"use client";

import { Plot } from "@/lib/types";
import { HomestayCard } from "@/components/homestay-card";
import { parseCoordinates, calculateDistance } from "@/lib/utils/geo-distance";

interface NearbyPlotsProps {
  latitude: string;
  longitude: string;
  allPlots: Plot[];
}

export function NearbyPlots({ latitude, longitude, allPlots }: NearbyPlotsProps) {
  const originLat = parseCoordinates(latitude);
  const originLon = parseCoordinates(longitude);

  if (Number.isNaN(originLat) || Number.isNaN(originLon)) {
    return null;
  }

  const nearbyPlots = allPlots
    .map((plot) => ({
      ...plot,
      distance: calculateDistance(
        originLat,
        originLon,
        parseCoordinates(plot.coordinates.latitude),
        parseCoordinates(plot.coordinates.longitude)
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  if (nearbyPlots.length === 0) return null;

  return (
    <div className="mt-12 border-t">
      <h2 className="mb-6 pt-8 font-caveat text-3xl font-bold">
        Homestays nearby
      </h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {nearbyPlots.map((plot) => (
          <HomestayCard key={plot.id} plot={plot} distance={plot.distance} />
        ))}
      </div>
    </div>
  );
}
