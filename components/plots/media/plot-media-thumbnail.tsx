import Image from "next/image";
import { Play } from "lucide-react";
import { PlotMedia } from "@/lib/types";

interface PlotMediaThumbnailProps {
  media: PlotMedia;
  isSelected: boolean;
  onSelect: () => void;
}

export function PlotMediaThumbnail({ media, isSelected, onSelect }: PlotMediaThumbnailProps) {
  return (
    <button
      onClick={onSelect}
      className="relative h-20 w-20 flex-shrink-0 group"
    >
      <Image
        src={media.type === 'video' ? (media.thumbnail || media.url) : media.url}
        alt="Plot media"
        fill
        className={`rounded-lg object-cover transition ${
          isSelected ? "ring-2 ring-[#FF385C]" : ""
        }`}
      />
      {media.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
      )}
    </button>
  );
}