import Image from "next/image";
import { User } from "lucide-react";
import { calculateYearsOrMonthsHostingString } from "@/lib/utils";
interface HostSectionProps {
  name: string;
  imageUrl: string;
  isPremier?: boolean;
  listingDate?: string;
}

export function HostSection({
  name,
  imageUrl,
  isPremier = false,
  listingDate,
}: HostSectionProps) {
  return (
    <div className="flex items-center gap-4 mt-8 border-t pt-6">
      <div className="relative h-14 w-14 rounded-full overflow-hidden border border-gray-200">
        <Image
          src={imageUrl}
          alt={`Host ${name}`}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <div className="text-lg font-semibold">Hosted by {name}</div>
        <div className="text-gray-600 text-sm flex items-center gap-2">
          {isPremier && (
            <span className="flex items-center gap-1">
              <span className="mr-2 h-2 w-2 rounded-full bg-[#FF385C] shrink-0" />
              Premier Host
            </span>
          )}
          {listingDate !== undefined && (
            <>
              {isPremier && <span className="mx-1">·</span>}
              {calculateYearsOrMonthsHostingString(listingDate)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
