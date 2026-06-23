"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { plots } from "@/lib/data/plots";
import { experiences } from "@/lib/data/experiences";
import { TripPlanner } from "@/components/trip-planner";
import { HomestayCard } from "@/components/homestay-card";
import { ExperienceCard } from "@/components/experience-card";
import { ALL_LOCATIONS } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home as HomeIcon, Compass } from "lucide-react";

export default function AllPlotsPage() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");

  const [filteredPlots, setFilteredPlots] = useState(plots);
  const [filteredExperiences, setFilteredExperiences] = useState(experiences);
  const [activeTab, setActiveTab] = useState("homestays");

  useEffect(() => {
    const storedTab = sessionStorage.getItem("exploreActiveTab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    if (locationParam && locationParam !== ALL_LOCATIONS) {
      setFilteredPlots((prev) =>
        prev.filter((p) => p.location === locationParam),
      );
      setFilteredExperiences((prev) =>
        prev.filter((e) => e.location === locationParam),
      );
    } else {
      // Reset if no location or all
      setFilteredPlots(plots);
      setFilteredExperiences(experiences);
    }
  }, [locationParam]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    sessionStorage.setItem("exploreActiveTab", value);
  };

  const handleSearch = (filters: {
    location?: string;
    guest: { adults: number; children: number; pets: number };
  }) => {
    let resultPlots = [...plots];
    let resultExperiences = [...experiences];

    // Filter by Location
    if (filters.location && filters.location !== "all") {
      resultPlots = resultPlots.filter((p) => p.location === filters.location);
      resultExperiences = resultExperiences.filter((e) => e.location === filters.location);
    }

    // Filter by Guests
    const totalGuests = filters.guest.adults + filters.guest.children;
    if (totalGuests > 0) {
      resultPlots = resultPlots.filter((p) => {
        const capacity = parseInt(p.guests, 10) || 0;
        return capacity >= totalGuests;
      });
    }

    setFilteredPlots(resultPlots);
    setFilteredExperiences(resultExperiences);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Planner Component */}
        <div className="flex justify-center mb-8 sticky top-4 z-40">
          <TripPlanner
            key={locationParam || 'default'}
            onSearch={handleSearch}
            initialLocation={locationParam || undefined}
          />
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8 w-full">
          <div className="flex justify-center mb-8 border-b border-gray-200">
            <TabsList className="bg-transparent p-0 h-auto gap-8 sm:gap-12 justify-center w-full text-gray-500">
              <TabsTrigger 
                value="homestays" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black rounded-none px-2 py-4 text-base font-semibold flex items-center gap-2 hover:text-black transition-colors"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Homes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="experiences" 
                className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black rounded-none px-2 py-4 text-base font-semibold flex items-center gap-2 hover:text-black transition-colors"
              >
                <div className="absolute top-1 -right-3 bg-slate-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm border border-slate-600 tracking-wider">NEW</div>
                <Compass className="w-5 h-5" />
                <span>Experiences</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="homestays">
            <h2 className="text-4xl font-bold font-caveat mb-8 text-gray-900">
              {filteredPlots.length === 0
                ? "No homestays found"
                : "Available Homestays"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {filteredPlots.map((plot) => (
                <HomestayCard key={plot.id} plot={plot} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experiences">
            <h2 className="text-4xl font-bold font-caveat mb-8 text-gray-900">
              {filteredExperiences.length === 0
                ? "No experiences found"
                : "Local Experiences"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {filteredExperiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

      </div>
      <div className="col-span-full text-center text-gray-400 py-10">
        Map and more listings coming soon...
      </div>
    </div>
  );
}
