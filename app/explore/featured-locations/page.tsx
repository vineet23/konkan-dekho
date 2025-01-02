"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

const featuredLocations = [
  {
    name: "Ratnagiri",
    description:
      "Beautiful coastal region with pristine beaches and mango orchards",
    image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488",
    plotCount: 12,
  },
  {
    name: "Sindhudurg",
    description: "Serene landscapes with historic forts and untouched beaches",
    image: "https://images.unsplash.com/photo-1502787530428-11cf61d6ba18",
    plotCount: 8,
  },
  {
    name: "Raigad",
    description:
      "Rich in history with stunning mountain views and coastal beauty",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    plotCount: 15,
  },
];

export default function FeaturedLocationsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-caveat font-bold mb-8">
        Featured Locations
      </h1>
      <p className="text-gray-600 mb-12 max-w-3xl">
        Discover our handpicked selection of prime locations in the Konkan
        region, each offering unique investment opportunities and natural
        beauty.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {featuredLocations.map((location) => (
          <Card key={location.name} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={location.image}
                alt={location.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-[#FF385C] mr-2" />
                <h2 className="text-xl font-semibold">{location.name}</h2>
              </div>
              <p className="text-gray-600 mb-4">{location.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {location.plotCount} plots available
                </span>
                <Link href={`/explore/all-plots?location=${location.name}`}>
                  <Button variant="ghost" size="sm">
                    View Plots <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
