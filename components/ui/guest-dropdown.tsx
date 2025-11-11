"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface Guest {
  adults: number;
  children: number;
  pets: number;
}

interface GuestDropdownProps {
  guest: Guest;
  setGuest: (guest: Guest) => void;
}

const GuestCounter = ({
  label,
  description,
  value,
  onDecrement,
  onIncrement,
  minValue = 0,
}: {
  label: string;
  description: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  minValue?: number;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium">{label}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={onDecrement}
        disabled={value === minValue}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-4 text-center">{value}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={onIncrement}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export function GuestDropdown({ guest, setGuest }: GuestDropdownProps) {
  const handleGuestChange = (type: keyof Guest, delta: number) => {
    const newCount = guest[type] + delta;
    const minValue = type === "adults" ? 1 : 0;
    setGuest({ ...guest, [type]: Math.max(minValue, newCount) });
  };

  const totalGuests = guest.adults + guest.children;
  const guestText =
    totalGuests > 1 ? `${totalGuests} Guests` : `${totalGuests} Guest`;
  const petText = guest.pets > 0 ? `, ${guest.pets} Pets` : "";

  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-full">
            <Label>Guests</Label>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal mt-1"
            >
              <span>
                {guestText}
                {petText}
              </span>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4 p-4">
            <GuestCounter
              label="Adults"
              description="Age 14 or above"
              value={guest.adults}
              onDecrement={() => handleGuestChange("adults", -1)}
              onIncrement={() => handleGuestChange("adults", 1)}
              minValue={1}
            />
            <GuestCounter
              label="Children"
              description="Ages 2–13"
              value={guest.children}
              onDecrement={() => handleGuestChange("children", -1)}
              onIncrement={() => handleGuestChange("children", 1)}
            />
            <GuestCounter
              label="Pets"
              description=""
              value={guest.pets}
              onDecrement={() => handleGuestChange("pets", -1)}
              onIncrement={() => handleGuestChange("pets", 1)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
