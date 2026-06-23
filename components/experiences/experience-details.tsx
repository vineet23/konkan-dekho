import { MapPin, IndianRupee, Languages, Info } from "lucide-react";
import { Experience } from "@/lib/types";
import { DescriptionWithReadMore } from "@/components/plots/description-read-more";

interface ExperienceDetailsProps {
  experience: Experience;
}

export function ExperienceDetails({ experience }: ExperienceDetailsProps) {
  return (
    <div className="mt-4 sm:mt-8">
      <h1 className="text-2xl sm:text-3xl font-bold">{experience.name}</h1>

      {/* Key Details */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:space-x-4 text-gray-600">
        <div className="flex items-center">
          <MapPin className="mr-1 h-5 w-5 shrink-0" />
          <span className="truncate">{experience.location}</span>
        </div>
        <div className="flex items-center">
          <IndianRupee className="mr-1 h-5 w-5 shrink-0" />
          <span>{typeof experience.rate === 'string' ? experience.rate.replace('₹', '') : experience.rate} per person</span>
        </div>
        <div className="flex items-center">
          <Languages className="mr-1 h-5 w-5 shrink-0" />
          <span>{Array.isArray(experience.language) ? experience.language.join(', ') : experience.language}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold">Description</h2>
        <DescriptionWithReadMore text={experience.description} />
      </div>

      {/* Guidelines */}
      {experience.guideline && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex gap-3 text-blue-800">
          <Info className="h-6 w-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Guidelines & Important Info</h3>
            <p className="text-sm leading-relaxed">{experience.guideline}</p>
          </div>
        </div>
      )}
    </div>
  );
}
