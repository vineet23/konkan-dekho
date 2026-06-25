"use client";

import Link from "next/link";
import Image from "next/image";
import { Plot } from "@/lib/types";
import { CardImageSlider } from "@/components/ui/card-image-slider";
import { convertPriceToNumber } from "@/lib/utils/filters";
import { formatIndianPrice } from "@/lib/utils/number-format";

interface HomestayCardProps {
  plot: Plot;
  distance?: number;
}

export function HomestayCard({ plot, distance }: HomestayCardProps) {
  return (
    <Link
      href={`/${plot.slug}-${plot.area.toLowerCase().replace(/ /g, "-")}`}
      className="group block"
    >
      <div className="relative aspect-[20/19] overflow-hidden rounded-xl bg-gray-200 mb-3">
        <CardImageSlider images={plot.images || []} alt={plot.title}>
          {plot.host?.isPremier && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm pointer-events-none z-10">
              <span className="text-[10px] sm:text-xs font-semibold text-gray-900">
                Premier Host
              </span>
            </div>
          )}
        </CardImageSlider>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate pr-2">
            {plot.title}
          </h3>
          {/* <div className="flex items-center gap-1 text-sm">
                                            <span className="text-black">★</span>
                                            <span>4.9</span>
                                        </div> */}
        </div>
        <div>
          <p className="text-gray-500 text-sm truncate">
            {plot.location}
            {distance !== undefined && (
              <span className="ml-1">
                ({Math.round(distance * 10) / 10} km away)
              </span>
            )}
          </p>
          <p className="text-gray-500 text-sm">{plot.guests} guests</p>
        </div>
        <div className="text-left">
          <span className="text-sm sm:text-base font-semibold text-gray-900">
            {formatIndianPrice(convertPriceToNumber(plot.price))}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm ml-1">night</span>
        </div>
      </div>
    </Link>
  );
}
