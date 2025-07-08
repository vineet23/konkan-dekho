import { PlotMedia } from "@/lib/types";

interface PlotMediaViewerProps {
  media: PlotMedia[];
}

export function PlotMediaViewer({ media }: PlotMediaViewerProps) {
  if (!Array.isArray(media)) return null;

  return (
    <div className="media-viewer space-y-4">
      {media.map((item, index) => {
        if (item.type === "video") {
          return (
            <video
              key={index}
              controls
              className="w-full rounded-md shadow"
              src={item.url}
              poster={item.thumbnail}
            />
          );
        } else {
          return (
            <img
              key={index}
              src={item.url}
              alt={`Media ${index + 1}`}
              className="w-full rounded-md shadow"
            />
          );
        }
      })}
    </div>
  );
}
