import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plot } from "@/lib/types";
import { convertPriceToNumber } from "@/lib/utils/filters";
import { formatIndianPrice } from "@/lib/utils/number-format";

interface PlotGridProps {
  plots: Plot[];
}

export function PlotGrid({ plots }: PlotGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plots.map((plot) => (
        <Link href={`/plots/${plot.id}`} key={plot.id}>
          <Card className="overflow-hidden rounded-xl border shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md">
            <div className="relative h-52 w-full">
              {plot.images.length > 0 ? (
                <Image
                  src={plot.images[0]}
                  alt={plot.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200 text-gray-500 text-sm">
                  No Image Available
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {plot.title}
              </h3>

              <div className="mt-1 flex items-center text-sm text-gray-600">
                <MapPin className="mr-1 h-4 w-4" />
                <span className="truncate">{plot.location}</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{plot.area}</p>
                  <p className="text-base font-bold text-[#FF385C]">
                    {formatIndianPrice(convertPriceToNumber(plot.price))}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
