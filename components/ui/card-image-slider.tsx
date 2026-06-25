"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Touch handlers for swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 30;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    return () => {
      if (sliderRef.current) {
        observer.unobserve(sliderRef.current);
      }
    };
  }, []);

  const startAutoPlay = () => {
    setIsAutoPlaying(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(false);
    }, 6000);
  };

  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && isVisible && images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, isVisible, images.length]);

  useEffect(() => {
    return () => stopAutoPlay();
  }, []);

  const handlePrevious = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    startAutoPlay();
  };

  const handleNext = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    startAutoPlay();
  };

  const handleDotClick = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
    startAutoPlay();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      // Swiping happened. Prevent link click.
      e.preventDefault();
      e.stopPropagation();
      if (isLeftSwipe) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      startAutoPlay();
    }
  };

  const getVisibleDots = () => {
    if (images.length <= 3) return images.map((_, i) => i);
    
    if (currentIndex === 0) return [0, 1, 2];
    if (currentIndex === images.length - 1) return [images.length - 3, images.length - 2, images.length - 1];
    
    return [currentIndex - 1, currentIndex, currentIndex + 1];
  };

  const visibleDots = getVisibleDots();

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-300">
        <span className="text-gray-500">No Image</span>
      </div>
    );
  }

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-full group/slider"
      onMouseEnter={() => {
        setIsHovered(true);
        startAutoPlay();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        stopAutoPlay();
        setCurrentIndex(0); // Optional: reset to first image on mouse leave
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black p-1 rounded-full shadow-md opacity-0 group-hover/slider:opacity-100 transition-opacity hidden sm:block"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black p-1 rounded-full shadow-md opacity-0 group-hover/slider:opacity-100 transition-opacity hidden sm:block"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-1 opacity-100 sm:opacity-0 group-hover/slider:opacity-100 transition-opacity">
          {visibleDots.map((actualIndex) => (
            <div
              key={actualIndex}
              onClick={(e) => handleDotClick(e, actualIndex)}
              onTouchStart={(e) => e.stopPropagation()} // Stop propagation to prevent card highlight
              className="p-1.5 cursor-pointer" // increased touch target
            >
              <button
                className={`block w-1.5 h-1.5 rounded-full transition-all ${
                  actualIndex === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/60 hover:bg-white/80"
                }`}
              />
            </div>
          ))}
        </div>
      )}
      
      {children}
    </div>
  );
}
