import Image from "next/image";
import { Play } from "lucide-react";
import { PlotMedia } from "@/lib/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PlotMediaThumbnailProps {
  media: PlotMedia;
  isSelected: boolean;
  onSelect: () => void;
}

export function PlotMediaThumbnail({ media, isSelected, onSelect }: PlotMediaThumbnailProps) {
  return (
    <button
      onClick={onSelect}
      className="w-24 flex-shrink-0 overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2"
    >
      <AspectRatio ratio={16 / 9}>
        <div className="relative h-full w-full">
          <Image
            src={media.type === 'video' ? (media.thumbnail || media.url) : media.url}
            alt="Plot media"
            fill
            className={`object-cover transition ${
              isSelected ? "ring-2 ring-[#FF385C]" : ""
            }`}
          />
          {media.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
          )}
        </div>
      </AspectRatio>
    </button>
  );
}