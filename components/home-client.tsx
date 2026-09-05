"use client";

import { useState, useEffect, useMemo } from "react";
import { TripPlanner } from "@/components/trip-planner";
import { HomestayCard } from "@/components/homestay-card";
import { ExperienceCard } from "@/components/experience-card";
import { ExperienceCategoryFilters } from "@/components/experiences/experience-category-filters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home as HomeIcon, Compass } from "lucide-react";
import { ExperienceCategory, Plot, Experience } from "@/lib/types";
import { filterExperiences } from "@/lib/utils/experience-filters";

export function HomeClient({
  plots,
  experiences,
}: {
  plots: Plot[];
  experiences: Experience[];
}) {
  const [filteredPlots, setFilteredPlots] = useState(plots);
  const [filteredExperiences, setFilteredExperiences] = useState(experiences);
  const [activeTab, setActiveTab] = useState("homestays");
  const [selectedCategory, setSelectedCategory] =
    useState<ExperienceCategory | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | undefined>();

  useEffect(() => {
    setFilteredPlots(plots);
    setFilteredExperiences(experiences);
  }, [plots, experiences]);

  const displayedExperiences = useMemo(
    () =>
      filterExperiences(filteredExperiences, {
        location: locationFilter,
        category: selectedCategory,
      }),
    [filteredExperiences, locationFilter, selectedCategory]
  );

  useEffect(() => {
    const storedTab = sessionStorage.getItem("homeActiveTab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    sessionStorage.setItem("homeActiveTab", value);
  };

  const handleSearch = (filters: {
    location?: string;
    guest: { adults: number; children: number; pets: number };
  }) => {
    let resultPlots = [...plots];
    let resultExperiences = [...experiences];

    if (filters.location && filters.location !== "all") {
      resultPlots = resultPlots.filter((p) => p.location === filters.location);
      resultExperiences = resultExperiences.filter(
        (e) => e.location === filters.location
      );
      setLocationFilter(filters.location);
    } else {
      setLocationFilter(undefined);
    }

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
        <div className="flex justify-center mb-8 sticky top-4 z-40">
          <TripPlanner
            onSearch={handleSearch}
            plots={plots}
            experiences={experiences}
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="mt-8 w-full"
        >
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
                <div className="absolute top-1 -right-8 bg-slate-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm border border-slate-600 tracking-wider">
                  NEW
                </div>
                <Compass className="w-5 h-5" />
                <span>Experiences</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="homestays">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
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
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {displayedExperiences.length === 0
                ? "No experiences found"
                : "Local Experiences"}
            </h2>
            <ExperienceCategoryFilters
              selected={selectedCategory}
              onChange={setSelectedCategory}
              className="mb-6"
            />
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {displayedExperiences.map((exp) => (
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
