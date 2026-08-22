"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlotMedia } from "@/lib/types";
import { PlotMediaThumbnail } from "./plot-media-thumbnail";
import { PlotMediaViewer } from "./plot-media-viewer";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PlotMediaGalleryProps {
  media: PlotMedia[];
  images: string[];
}

const MIN_SWIPE_DISTANCE = 30;

export function PlotMediaGallery({ media, images }: PlotMediaGalleryProps) {
  const allMedia: PlotMedia[] = [
    ...media,
    ...images.map((url) => ({ type: "image" as const, url })),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedMedia = allMedia[selectedIndex];
  const blockNextClickRef = useRef(false);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const goToPrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? allMedia.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev + 1) % allMedia.length);
  };

  useEffect(() => {
    thumbnailRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd || allMedia.length <= 1) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe || isRightSwipe) {
      e.preventDefault();
      e.stopPropagation();
      blockNextClickRef.current = true;
      window.setTimeout(() => {
        blockNextClickRef.current = false;
      }, 300);

      if (isLeftSwipe) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  if (allMedia.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Main Media Viewer with 16:9 Aspect Ratio */}
      <div
        className="group relative touch-pan-y overflow-hidden rounded-lg border bg-background"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AspectRatio ratio={16 / 9}>
          <PlotMediaViewer
            media={selectedMedia}
            blockNextClickRef={blockNextClickRef}
          />
        </AspectRatio>

        {allMedia.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-opacity hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-opacity hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-2 right-2 z-10 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
              {selectedIndex + 1} / {allMedia.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div
        className="flex gap-2 overflow-x-auto py-2 snap-x"
        style={{ scrollbarColor: "#D1D1D1 white" }}
      >
        {allMedia.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              thumbnailRefs.current[index] = el;
            }}
            className="snap-start"
          >
            <PlotMediaThumbnail
              media={item}
              isSelected={selectedIndex === index}
              onSelect={() => setSelectedIndex(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
