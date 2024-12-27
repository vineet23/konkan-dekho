"use client";

import Image from "next/image";

interface PlotGalleryProps {
  images: string[];
  selectedImage: string;
  onImageSelect: (image: string) => void;
}

export function PlotGallery({ images, selectedImage, onImageSelect }: PlotGalleryProps) {
  return (
    <div>
      <div className="relative h-[400px] overflow-hidden rounded-lg">
        <Image
          src={selectedImage}
          alt="Plot view"
          fill
          className="object-cover"
        />
      </div>
      <div className="mt-4 flex gap-4 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(image)}
            className="relative h-20 w-20 flex-shrink-0"
          >
            <Image
              src={image}
              alt={`View ${index + 1}`}
              fill
              className={`rounded-lg object-cover transition ${
                selectedImage === image ? "ring-2 ring-[#FF385C]" : ""
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}