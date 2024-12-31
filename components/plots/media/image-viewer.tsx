"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Maximize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageViewerProps {
  src: string;
  alt: string;
}

export function ImageViewer({ src, alt }: ImageViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      {/* Regular View */}
      <div className="group relative h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onClick={() => setIsFullscreen(true)}
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => setIsFullscreen(true)}
          aria-label="View fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="h-[90vh] max-w-[90vw] p-0">
          <VisuallyHidden>
            <DialogTitle>Image Viewer - {alt}</DialogTitle>
          </VisuallyHidden>

          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="absolute left-4 top-4 z-10 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => zoomIn()}
                    className="bg-white/80 backdrop-blur-sm"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => zoomOut()}
                    className="bg-white/80 backdrop-blur-sm"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => resetTransform()}
                    className="bg-white/80 backdrop-blur-sm"
                    aria-label="Reset zoom"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <TransformComponent
                  wrapperClass="!w-full !h-full"
                  contentClass="!w-full !h-full"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-contain"
                      quality={100}
                      priority
                    />
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </DialogContent>
      </Dialog>
    </>
  );
}
