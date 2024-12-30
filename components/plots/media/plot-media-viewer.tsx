"use client";

import Image from "next/image";
import { PlotMedia } from "@/lib/types";

interface PlotMediaViewerProps {
  media: PlotMedia;
}

export function PlotMediaViewer({ media }: PlotMediaViewerProps) {
  if (media.type === 'video') {
    return (
      <video
        src={media.url}
        controls
        className="absolute inset-0 w-full h-full object-contain bg-black"
        poster={media.thumbnail}
      />
    );
  }

  return (
    <Image
      src={media.url}
      alt="Plot view"
      fill
      className="object-cover"
      priority
    />
  );
}