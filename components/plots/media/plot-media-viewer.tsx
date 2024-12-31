"use client";

import { PlotMedia } from "@/lib/types";
import { ImageViewer } from "./image-viewer";

interface PlotMediaViewerProps {
  media: PlotMedia;
}

export function PlotMediaViewer({ media }: PlotMediaViewerProps) {
  if (media.type === 'video') {
    return (
      <video
        src={media.url}
        controls
        className="absolute inset-0 h-full w-full object-cover"
        poster={media.thumbnail}
        playsInline
      />
    );
  }

  return <ImageViewer src={media.url} alt="Plot view" />;
}