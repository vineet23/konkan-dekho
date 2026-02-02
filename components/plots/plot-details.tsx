import { MapPin, SquareDashed, IndianRupee, Map, User } from "lucide-react";
import { Plot } from "@/lib/types";
import { MapLink } from "./map-link";
import { HostSection } from "./host-section";
import { FeatureIcon } from "./feature-icon";
import { DescriptionWithReadMore } from "./description-read-more";

interface PlotDetailsProps {
  plot: Plot;
}

export function PlotDetails({ plot }: PlotDetailsProps) {
  return (
    <div className="mt-4 sm:mt-8">
      <h1 className="text-2xl sm:text-3xl font-bold">{plot.title}</h1>

      {/* Key Details */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:space-x-4 text-gray-600">
        <div className="flex items-center">
          <MapPin className="mr-1 h-5 w-5 shrink-0" />
          <span className="truncate">{plot.location}</span>
        </div>
        <div className="flex items-center">
          <User className="mr-1 h-5 w-5 shrink-0" />
          <span>{plot.guests} guests max</span>
        </div>
        <div className="flex items-center">
          <IndianRupee className="mr-1 h-5 w-5 shrink-0" />
          <span>{plot.price.slice(1)} per night</span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold">Description</h2>
        <DescriptionWithReadMore text={plot.description} />
      </div>

      {/* Features */}
      <div className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold">Features</h2>
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {plot.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center text-gray-600 text-sm sm:text-base"
            >
              <FeatureIcon feature={feature} className="mr-2 h-5 w-5 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Location */}
      <div className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Location</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center space-x-4 text-gray-600 text-sm sm:text-base">
            <Map className="h-5 w-5 shrink-0" />
            <span className="break-all sm:break-normal">
              {plot.coordinates.latitude}, {plot.coordinates.longitude}
            </span>
          </div>
          <MapLink coordinates={plot.coordinates} />
        </div>
      </div>

      {/* Host Section */}
      {plot.host && (
        <HostSection
          name={plot.host?.name || ""}
          imageUrl={plot.host?.imageUrl || "/image/logo.svg"}
          isPremier={plot.host?.isPremier}
          listingDate={plot.host?.listingDate}
        />
      )}
    </div>
  );
}
