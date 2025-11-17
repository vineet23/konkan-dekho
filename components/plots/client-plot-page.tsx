"use client";

import { PlotDetails } from "./plot-details";
import { ContactForm } from "./contact-form";
import { plots } from "@/lib/data/plots";
import { PlotMediaGallery } from "./media/plot-media-gallery";
import { SimilarPlots } from "./similar-plots";

export function ClientPlotPage({ id }: { id: string }) {
  const plot = plots.find((p) => p.id === parseInt(id));

  if (!plot) {
    return <div>Plot/Homestay not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      {/* Mobile: Stack vertically */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Media and Details */}
        <div className="lg:col-span-2 space-y-6">
          <PlotMediaGallery media={plot.media} images={plot.images} />
          <PlotDetails plot={plot} />
          {/* Mobile Contact Form */}
          <div className="block lg:hidden">
            <ContactForm
              phone={plot.phone}
              name={plot.title}
              slug={plot.slug}
            />
          </div>
          <SimilarPlots currentPlot={plot} allPlots={plots} />
        </div>
        {/* Contact Form - Sticky on desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <ContactForm
              phone={plot.phone}
              name={plot.title}
              slug={plot.slug}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
