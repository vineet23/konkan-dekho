"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import { DarkModeToggle } from "./dark-mode-toggle"; // ✅ Import your component

export function Navbar() {
  return (
    <nav className="border-b bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
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

        {/* Search Bar (center) */}
        <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-300" />
            <Input
              className="w-full pl-10 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              placeholder="Search for plots by location..."
              type="search"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Dark mode toggle button */}
          <DarkModeToggle /> {/* ✅ This shows your "☀️ Light Mode / 🌙 Dark Mode" */}

          {/* Links */}
          <Link href="/explore/list-your-plot">
            <Button variant="ghost" className="dark:text-white">
              List Your Plot
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-[#FF385C] hover:bg-[#D93B60] text-white">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
