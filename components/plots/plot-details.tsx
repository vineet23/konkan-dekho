import Image from "next/image";
import { MapPin, SquareDashed, IndianRupee, Map } from "lucide-react";
import { Plot } from "@/lib/types";

interface Props { plot: Plot }

export function PlotDetails({ plot }: Props) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h1 className="text-2xl font-bold">{plot.title}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-gray-600">
        <div className="flex items-center space-x-2">
          <MapPin /><span>{plot.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <SquareDashed /><span>{plot.area}</span>
        </div>
        <div className="flex items-center space-x-2">
          <IndianRupee /><span>{plot.price}</span>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{plot.description}</p>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Features</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {plot.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-gray-600">
              <span className="inline-block w-2 h-2 bg-[#FF385C] rounded-full mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Location</h2>
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="250"
            src={plot.googleMapsUrl.replace("/maps?", "/maps/embed?")}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
