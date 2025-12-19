"use client";

import { useMemo } from "react";
import { Plot } from "@/lib/types";
import { MapPin, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SearchDropdownProps {
    query: string;
    plots: Plot[];
    onSelect: (searchQuery: string) => void;
}

export function SearchDropdown({
    query,
    plots,
    onSelect,
}: SearchDropdownProps) {
    const { filteredResults, hasResults } = useMemo(() => {
        if (!query.trim()) {
            return { filteredResults: { plots: [], locations: [] }, hasResults: false };
        }

        const lowerQuery = query.toLowerCase();

        // Filter plots by title, location, or description
        const matchedPlots = plots.filter(
            (plot) =>
                plot.title.toLowerCase().includes(lowerQuery) ||
                plot.location.toLowerCase().includes(lowerQuery) ||
                plot.description.toLowerCase().includes(lowerQuery)
        );

        // Get unique locations that match the query
        const matchedLocations = Array.from(
            new Set(
                plots
                    .filter((plot) => plot.location.toLowerCase().includes(lowerQuery))
                    .map((plot) => plot.location)
            )
        );

        const results = {
            plots: matchedPlots.slice(0, 4),
            locations: matchedLocations.slice(0, 4),
        };

        return {
            filteredResults: results,
            hasResults: results.plots.length > 0 || results.locations.length > 0,
        };
    }, [query, plots]);

    if (!query.trim() || !hasResults) {
        return null;
    }

    const { plots: resultPlots, locations: resultLocations } = filteredResults;

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-xl z-50 max-h-96 overflow-y-auto">
            {/* Locations Section */}
            {resultLocations.length > 0 && (
                <div>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 font-semibold text-xs text-gray-600 uppercase tracking-wide">
                        Locations
                    </div>
                    {resultLocations.map((location) => (
                        <button
                            key={location}
                            onClick={() => {
                                onSelect(location);
                            }}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left border-b border-gray-100 last:border-b-0 focus:outline-none"
                        >
                            <MapPin className="h-4 w-4 text-red-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700 font-medium">{location}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Plots Section */}
            {resultPlots.length > 0 && (
                <div>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 font-semibold text-xs text-gray-600 uppercase tracking-wide">
                        Homestays
                    </div>
                    {resultPlots.map((plot) => (
                        <Link
                            key={plot.id}
                            href={`/${plot.slug}-${plot.area.toLowerCase().replace(/ /g, "-")}`}
                            onClick={() => onSelect("")}
                            className="block w-full"
                        >
                            <div className="px-4 py-3 hover:bg-red-50 transition-colors flex gap-3 border-b border-gray-100 last:border-b-0 cursor-pointer">
                                <div className="relative h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                                    <Image
                                        src={plot.images[0]}
                                        alt={plot.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {plot.title}
                                    </h4>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate">{plot.location}</span>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {plot.price}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-0.5">
                                        <Home className="h-3 w-3" />
                                        <span>{plot.guests}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
