"use client";

import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

interface MapLinkProps {
  coordinates: {
    latitude: string;   // e.g. "16.985152798810304° N"
    longitude: string;  // e.g. "73.29886364275058° E"
  };
  label?: string;       // optional: "Sea Nest Villa"
  zoom?: number;        // optional: 12..18 (14-16 shows good region)
}

function parseCoord(value: string) {
  // Handles "17.10° N", "73.29° E", with optional spaces or lowercase
  const v = value.replace(/\s+/g, "").toUpperCase(); // "17.10°N"
  const match = v.match(/^([+-]?\d+(\.\d+)?)(?:°)?([NSEW])?$/);
  if (!match) return Number.NaN;

  let num = parseFloat(match[1]);
  const hemi = match[3];
  if (hemi === "S" || hemi === "W") num = -Math.abs(num);
  if (hemi === "N" || hemi === "E") num = Math.abs(num);
  return num;
}

export function MapLink({ coordinates, label, zoom = 15 }: MapLinkProps) {
  const handleOpenMap = () => {
    const lat = parseCoord(coordinates.latitude);
    const lng = parseCoord(coordinates.longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    // Best UX: pin + surrounding region at chosen zoom
    // Example: https://www.google.com/maps/place/16.98,73.30/@16.98,73.30,15z
    const placeLabel = label ? `/${encodeURIComponent(label)}` : "";
    const mapsUrl = `https://www.google.com/maps/place/${lat},${lng}${placeLabel}/@${lat},${lng},${zoom}z`;

    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      onClick={handleOpenMap}
      variant="outline"
      className="w-full sm:w-auto flex items-center justify-center gap-2"
    >
      <Map className="h-4 w-4" />
      <span className="text-sm">View on Google Maps</span>
    </Button>
  );
}
