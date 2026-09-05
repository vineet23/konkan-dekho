"use client";

import { PlotDetails } from "./plot-details";
import { ContactForm } from "./contact-form";
import { PlotMediaGallery } from "./media/plot-media-gallery";
import { SimilarPlots } from "./similar-plots";
import { NearbyExperiences } from "./nearby-experiences";
import type { Plot, Experience } from "@/lib/types";

export function ClientPlotPage({
  plot,
  allPlots,
  experiences,
}: {
  plot: Plot;
  allPlots: Plot[];
  experiences: Experience[];
}) {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PlotMediaGallery media={plot.media} images={plot.images} />
          <PlotDetails plot={plot} />
          <div className="block lg:hidden">
            <ContactForm
              phone={plot.phone}
              name={plot.title}
              slug={plot.slug}
              icalUrls={plot.ical}
            />
          </div>
          <NearbyExperiences plot={plot} experiences={experiences} />
          <SimilarPlots currentPlot={plot} allPlots={allPlots} />
        </div>
        <div className="hidden lg:block lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <ContactForm
              phone={plot.phone}
              name={plot.title}
              slug={plot.slug}
              icalUrls={plot.ical}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
