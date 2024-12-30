"use client";

import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

interface MapLinkProps {
  coordinates: {
    latitude: string;
    longitude: string;
  };
}

export function MapLink({ coordinates }: MapLinkProps) {
  const handleOpenMap = () => {
    const lat = parseFloat(coordinates.latitude.replace('° N', ''));
    const lng = parseFloat(coordinates.longitude.replace('° E', ''));
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapsUrl, '_blank');
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