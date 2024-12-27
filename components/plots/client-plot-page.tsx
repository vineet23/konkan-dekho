"use client";

import { useState } from "react";
import { PlotGallery } from "./plot-gallery";
import { PlotDetails } from "./plot-details";
import { ContactForm } from "./contact-form";
import { plots } from "@/lib/data/plots";

export function ClientPlotPage({ id }: { id: string }) {
  const plot = plots.find(p => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(plot?.images[0] ?? "");

  if (!plot) {
    return <div>Plot not found</div>;
  }
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PlotGallery
            images={plot.images}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />
          <PlotDetails plot={plot} />
        </div>
        <div className="lg:col-span-1">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}