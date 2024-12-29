"use client";

import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-[#FF385C]" />
            <span className="text-xl font-bold text-[#FF385C]">
              Konkan Dekho
            </span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              className="w-full pl-10"
              placeholder="Search for plots by location..."
              type="search"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/explore/list-your-plot">
            <Button variant="ghost">List Your Plot</Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-[#FF385C] hover:bg-[#D93B60]">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
