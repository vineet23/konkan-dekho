import { MapPin, Square, IndianRupee, Map } from "lucide-react";
import { Plot } from "@/lib/types";

interface PlotDetailsProps {
  plot: Plot;
}

export function PlotDetails({ plot }: PlotDetailsProps) {
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold">{plot.title}</h1>
      <div className="mt-4 flex items-center space-x-4 text-gray-600">
        <div className="flex items-center">
          <MapPin className="mr-1 h-5 w-5" />
          {plot.location}
        </div>
        <div className="flex items-center">
          <Square className="mr-1 h-5 w-5" />
          {plot.area}
        </div>
        <div className="flex items-center">
          <IndianRupee className="mr-1 h-5 w-5" />
          {plot.price}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="mt-2 text-gray-600">{plot.description}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="mt-2 grid grid-cols-2 gap-2">
          {plot.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <span className="mr-2 h-2 w-2 rounded-full bg-[#FF385C]" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Location</h2>
        <div className="mt-2 flex items-center space-x-4 text-gray-600">
          <Map className="h-5 w-5" />
          <span>
            {plot.coordinates.latitude}, {plot.coordinates.longitude}
          </span>
        </div>
      </div>
    </div>
  );
}