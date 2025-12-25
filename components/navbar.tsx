"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import { SearchDropdown } from "./plots/search-dropdown";
import { plots } from "@/lib/data/plots";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleLocationSelect = (location: string) => {
    setSearchQuery("");
    router.push(`/explore/all-plots?location=${encodeURIComponent(location)}`);
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/image/logo.svg"
              alt="Konkan Dekho"
              width={48}
              height={48}
            />
            <span className="text-4xl font-bold text-[#FF385C] font-caveat self-end">
              Konkan Dekho
            </span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              className="w-full pl-10"
              placeholder="Search for homestays by location..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchDropdown
              query={searchQuery}
              plots={plots}
              onSelect={handleLocationSelect}
            />
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/explore/list-your-plot">
            <Button variant="ghost">List Your Plot/Homestay</Button>
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
