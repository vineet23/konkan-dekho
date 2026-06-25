"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardImageSliderProps {
  images: string[];
  alt: string;
  children?: React.ReactNode;
}

export function CardImageSlider({ images, alt, children }: CardImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 1500);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isHovered, images.length]);

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-300">
        <span className="text-gray-500">No Image</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full group/slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentIndex(0); // Optional: reset to first image on mouse leave
      }}
    >
      <div className="flex w-full h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <Image
              src={image}
              alt={`${alt} image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && isHovered && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black p-1 rounded-full shadow-md opacity-0 group-hover/slider:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black p-1 rounded-full shadow-md opacity-0 group-hover/slider:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 opacity-0 group-hover/slider:opacity-100 transition-opacity">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => handleDotClick(e, index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
      
      {children}
    </div>
  );
}
