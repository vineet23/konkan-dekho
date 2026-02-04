"use client";

import { useState } from "react";
import { plots } from "@/lib/data/plots";
import { HomestayCard } from "@/components/homestay-card";
import { TripPlanner } from "@/components/trip-planner";

interface LocationPlotsClientProps {
    slug: string;
}

export default function LocationPlotsClient({
    slug,
}: LocationPlotsClientProps) {
    // Decode inside the client component or pass decoded prop.
    // Passing slug directly and decoding here to match previous logic safely.
    const locationName = decodeURIComponent(slug);

    const [filteredPlots, setFilteredPlots] = useState(
        plots.filter(
            (p) => p.location.toLowerCase() === locationName.toLowerCase(),
        ),
    );

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
                {/* <h1 className="text-4xl font-bold font-caveat mb-8 text-center">
                    Stays in {locationName}
                </h1> */}

                {/* Trip Planner Component */}
                <div className="flex justify-center mb-8 sticky top-4 z-40">
                    <TripPlanner
                        initialLocation={locationName}
                        onSearch={handleSearch}
                    />
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">
                        {filteredPlots.length === 0
                            ? "No homestays found"
                            : `Available Homestays`}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {filteredPlots.map((plot) => (
                            <HomestayCard key={plot.id} plot={plot} />
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
