"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Plot } from "@/lib/types";
import { Experience } from "@/lib/types";
import { ExperienceCard } from "@/components/experience-card";
import { parseCoordinates, calculateDistance } from "@/lib/utils/geo-distance";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface NearbyExperiencesProps {
  plot: Plot;
  experiences: Experience[];
}

export function NearbyExperiences({ plot, experiences }: NearbyExperiencesProps) {
  const nearbyExperiences = useMemo(() => {
    const originLat = parseCoordinates(plot.coordinates.latitude);
    const originLon = parseCoordinates(plot.coordinates.longitude);

    if (Number.isNaN(originLat) || Number.isNaN(originLon)) {
      return [];
    }

    return experiences
      .filter((experience) => experience.coordinates)
      .map((experience) => ({
        ...experience,
        distance: calculateDistance(
          originLat,
          originLon,
          parseCoordinates(experience.coordinates!.latitude),
          parseCoordinates(experience.coordinates!.longitude)
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [plot.coordinates.latitude, plot.coordinates.longitude, experiences]);

  if (nearbyExperiences.length === 0) {
    return null;
  }

  const showNavigation = nearbyExperiences.length > 3;

  return (
    <div className="mt-12 border-t">
      <Carousel
        opts={{
          align: "start",
          dragFree: false,
          slidesToScroll: 1,
          containScroll: "trimSnaps",
        }}
        className="w-full pt-8"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-caveat text-3xl font-bold">
              Experiences nearby
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Things to do close to this homestay
            </p>
          </div>

          {showNavigation && (
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <CarouselPrevious className="static h-9 w-9 translate-x-0 translate-y-0 rounded-full border-gray-200 bg-white shadow-sm" />
              <CarouselNext className="static h-9 w-9 translate-x-0 translate-y-0 rounded-full border-gray-200 bg-white shadow-sm" />
            </div>
          )}
        </div>

        <CarouselContent className="-ml-3 sm:-ml-4 lg:-ml-6">
          {nearbyExperiences.map((experience) => (
            <CarouselItem
              key={experience.id}
              className="basis-1/2 pl-3 sm:basis-1/2 sm:pl-4 md:basis-1/3 lg:basis-1/3 lg:pl-6"
            >
              <ExperienceCard
                experience={experience}
                distance={experience.distance}
                compact
                minimal
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {nearbyExperiences.length > 2 && (
          <p className="mt-3 text-center text-xs text-gray-400 lg:hidden">
            Swipe to see more
          </p>
        )}
      </Carousel>

      <Link
        href="/experiences"
        className="mt-6 inline-block text-sm font-medium text-[#FF385C] hover:text-[#D93B60]"
      >
        View all experiences →
      </Link>
    </div>
  );
}
