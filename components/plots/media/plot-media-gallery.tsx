"use client";

import { useState } from "react";
import { PlotMedia } from "@/lib/types";
import { PlotMediaThumbnail } from "./plot-media-thumbnail";
import { PlotMediaViewer } from "./plot-media-viewer";

interface PlotMediaGalleryProps {
  media: PlotMedia[];
  images: string[]; // Keep for backward compatibility
}

export function PlotMediaGallery({ media, images }: PlotMediaGalleryProps) {
  // Convert legacy images to media format
  const allMedia: PlotMedia[] = [
    ...media,
    ...images.map(url => ({ type: 'image' as const, url }))
  ];

  const [selectedMedia, setSelectedMedia] = useState<PlotMedia>(allMedia[0]);

  return (
    <div>
      <div className="relative h-[400px] overflow-hidden rounded-lg">
        <PlotMediaViewer media={selectedMedia} />
      </div>
      
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {allMedia.map((item, index) => (
          <PlotMediaThumbnail
            key={index}
            media={item}
            isSelected={selectedMedia.url === item.url}
            onSelect={() => setSelectedMedia(item)}
          />
        ))}
      </div>
    </div>
  );
}