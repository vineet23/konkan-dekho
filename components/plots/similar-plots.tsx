import { Plot } from "@/lib/types";

interface SimilarPlotsProps {
  currentPlot: Plot;
  allPlots: Plot[];
}

function parseLatLonFromUrl(url: string): { lat: number; lon: number } | null {
  const match = url.match(/q=([-.\d]+),([-.\d]+)/);
  if (!match) return null;
  return {
    lat: parseFloat(match[1]),
    lon: parseFloat(match[2]),
  };
}

export function SimilarPlots({ currentPlot, allPlots }: SimilarPlotsProps) {
  const getSimilarPlots = () => {
    const currentCoords = parseLatLonFromUrl(currentPlot.googleMapsUrl);
    if (!currentCoords) return [];

    const currentLat = currentCoords.lat;
    const currentLon = currentCoords.lon;

    return allPlots
      .filter((plot) => plot.id !== currentPlot.id)
      .map((plot) => {
        const coords = parseLatLonFromUrl(plot.googleMapsUrl);
        if (!coords) return { plot, distance: Infinity };

        const distance = Math.sqrt(
          Math.pow(currentLat - coords.lat, 2) + Math.pow(currentLon - coords.lon, 2)
        );

        return { plot, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3) // show 3 most similar
      .map((entry) => entry.plot);
  };

  const similarPlots = getSimilarPlots();

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Similar Properties</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {similarPlots.map((plot) => (
          <li key={plot.id} className="p-4 border rounded shadow">
            <h3 className="text-md font-semibold">{plot.title}</h3>
            <p className="text-sm text-gray-600">{plot.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
