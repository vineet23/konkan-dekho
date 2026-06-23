"use client";

import { experiences } from "@/lib/data/experiences";
import { PlotMediaGallery } from "@/components/plots/media/plot-media-gallery";
import { ExperienceDetails } from "./experience-details";
import { ExperienceContactForm } from "./experience-contact-form";

export function ClientExperiencePage({ slug }: { slug: string }) {
  const experience = experiences.find((e) => e.slug === slug);

  if (!experience) {
    return <div>Experience not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      {/* Mobile: Stack vertically */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Media and Details */}
        <div className="lg:col-span-2 space-y-6">
          <PlotMediaGallery media={[]} images={experience.photos} />
          <ExperienceDetails experience={experience} />
          {/* Mobile Contact Form */}
          <div className="block lg:hidden">
            <ExperienceContactForm
              phone={experience.phone}
              name={experience.name}
              slug={experience.slug}
            />
          </div>
        </div>
        {/* Contact Form - Sticky on desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <ExperienceContactForm
              phone={experience.phone}
              name={experience.name}
              slug={experience.slug}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
