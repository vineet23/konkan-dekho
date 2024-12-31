"use client";

import { useState } from "react";
import { PlotMedia } from "@/lib/types";
import { PlotMediaThumbnail } from "./plot-media-thumbnail";
import { PlotMediaViewer } from "./plot-media-viewer";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PlotMediaGalleryProps {
  media: PlotMedia[];
  images: string[];
}

export function PlotMediaGallery({ media, images }: PlotMediaGalleryProps) {
  const allMedia: PlotMedia[] = [
    ...media,
    ...images.map(url => ({ type: 'image' as const, url }))
  ];

  const [selectedMedia, setSelectedMedia] = useState<PlotMedia>(allMedia[0]);

  return (
    <div className="space-y-4">
      {/* Main Media Viewer with 16:9 Aspect Ratio */}
      <div className="overflow-hidden rounded-lg border bg-background">
        <AspectRatio ratio={16 / 9}>
          <PlotMediaViewer media={selectedMedia} />
        </AspectRatio>
      </div>
      
      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
        {allMedia.map((item, index) => (
          <div key={index} className="snap-start">
            <PlotMediaThumbnail
              media={item}
              isSelected={selectedMedia.url === item.url}
              onSelect={() => setSelectedMedia(item)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}