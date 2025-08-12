import { MapPin, IndianRupee, Map, User } from "lucide-react";
import { Plot } from "@/lib/types";
import { MapLink } from "./map-link";
import HostInlineBadge from "@/components/team/HostInLineBadge"; // ✅ fix file name (Inline, not InLine)

interface PlotDetailsProps {
  plot: Plot;
}

export function PlotDetails({ plot }: PlotDetailsProps) {
  // Optional: guard to avoid crashing if price is not prefixed with ₹
  const priceNumeric = plot.price.startsWith("₹")
    ? plot.price.slice(1)
    : plot.price;

  return (
    <div className="mt-4 sm:mt-8">
      <h1 className="text-2xl sm:text-3xl font-bold">{plot.title}</h1>

      {/* Host (auto-hides if no hostId or unknown host) */}
      <div className="mt-2">
        <HostInlineBadge hostId={plot.hostId} />
      </div>

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
          <span>{priceNumeric} per night</span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold">Description</h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">{plot.description}</p>
      </div>

      {/* Features */}
      <div className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold">Features</h2>
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {plot.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600 text-sm sm:text-base">
              <span className="mr-2 h-2 w-2 rounded-full bg-[#FF385C] shrink-0" />
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
    </div>
  );
}
