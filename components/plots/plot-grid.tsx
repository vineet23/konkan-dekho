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
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {plots.map((plot) => (
        <Link href={`/plots/${plot.id}`} key={plot.id}>
          <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
            <div className="relative h-48">
              <Image
                src={plot.images[0]}
                alt={plot.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{plot.title}</h3>
              <div className="mt-2 flex items-center text-gray-600">
                <MapPin className="mr-1 h-4 w-4" />
                {plot.location}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{plot.area}</p>
                  <p className="text-lg font-bold text-[#FF385C]">
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