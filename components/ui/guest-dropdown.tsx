"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Users } from "lucide-react";

interface GuestDropdownProps {
  value: {
    adults: number;
    children: number;
    pets: number;
  };
  onChange: (value: {
    adults: number;
    children: number;
    pets: number;
  }) => void;
}

export function GuestDropdown({ value, onChange }: GuestDropdownProps) {
  const { adults, children, pets } = value;

  const handleIncrement = (type: "adults" | "children" | "pets") => {
    onChange({ ...value, [type]: value[type] + 1 });
  };

  const handleDecrement = (type: "adults" | "children" | "pets") => {
    if (value[type] > 0) {
      if (type === "adults" && value[type] === 1) return;
      onChange({ ...value, [type]: value[type] - 1 });
    }
  };

  const totalGuests = adults + children;
  const guestText = `${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}${
    pets > 0 ? `, ${pets} Pet${pets !== 1 ? "s" : ""}` : ""
  }`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex justify-start font-normal"
        >
          <Users className="mr-2 h-4 w-4" />
          {guestText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Guests</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="font-semibold">Adults</p>
              <p className="text-sm text-gray-500">Age 13 or above</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDecrement("adults")}
                disabled={adults <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span>{adults}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleIncrement("adults")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="font-semibold">Children</p>
              <p className="text-sm text-gray-500">Ages 2–12</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDecrement("children")}
                disabled={children <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span>{children}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleIncrement("children")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="font-semibold">Pets</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDecrement("pets")}
                disabled={pets <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span>{pets}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleIncrement("pets")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
