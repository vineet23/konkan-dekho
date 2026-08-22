"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Maximize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, type MutableRefObject } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageViewerProps {
  src: string;
  alt: string;
  blockNextClickRef?: MutableRefObject<boolean>;
}

export function ImageViewer({ src, alt, blockNextClickRef }: ImageViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openFullscreen = () => {
    if (blockNextClickRef?.current) {
      blockNextClickRef.current = false;
      return;
    }
    setIsFullscreen(true);
  };

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace" || e.key === "Escape") {
        e.preventDefault();
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <>
      {/* Regular View */}
      <div className="group relative h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onClick={openFullscreen}
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={openFullscreen}
          aria-label="View fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Fullscreen Lightbox */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="fixed inset-0 left-0 top-0 z-50 flex h-screen w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 border-0 bg-black p-0 shadow-none sm:rounded-none [&>button]:right-4 [&>button]:top-4 [&>button]:text-white [&>button]:opacity-80 [&>button]:hover:bg-white/10 [&>button]:hover:opacity-100">
          <VisuallyHidden>
            <DialogTitle>Image Viewer - {alt}</DialogTitle>
          </VisuallyHidden>

          <div className="relative flex min-h-0 flex-1 w-full">
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={4}
              centerOnInit
              doubleClick={{ mode: "zoomIn" }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <TransformComponent
                    wrapperClass="!h-full !w-full"
                    contentClass="!flex !h-full !w-full !items-center !justify-center"
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-contain"
                        quality={100}
                        priority
                        sizes="100vw"
                      />
                    </div>
                  </TransformComponent>

                  <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-1.5 backdrop-blur-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => zoomOut()}
                      className="h-9 w-9 text-white hover:bg-white/10 hover:text-white"
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => zoomIn()}
                      className="h-9 w-9 text-white hover:bg-white/10 hover:text-white"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => resetTransform()}
                      className="h-9 w-9 text-white hover:bg-white/10 hover:text-white"
                      aria-label="Reset zoom"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </TransformWrapper>
          </div>

          <p className="pointer-events-none absolute bottom-6 right-4 hidden text-xs text-white/50 sm:block">
            Press Backspace or Esc to close
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
