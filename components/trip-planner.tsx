"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { plots } from "@/lib/data/plots";
import { DateRange } from "react-day-picker";
import { Search, Minus, Plus, X } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Helper component for Guest Counter
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
    <div className="flex items-center justify-between py-2">
        <div>
            <p className="font-medium text-md">{label}</p>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
        </div>
        <div className="flex items-center gap-3">
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-gray-300 text-gray-500 hover:border-black hover:text-black"
                onClick={onDecrement}
                disabled={value === minValue}
            >
                <Minus className="h-3 w-3" />
            </Button>
            <span className="w-4 text-center text-sm font-medium">{value}</span>
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-gray-300 text-gray-500 hover:border-black hover:text-black"
                onClick={onIncrement}
            >
                <Plus className="h-3 w-3" />
            </Button>
        </div>
    </div>
);

export function TripPlanner({
    onSearch,
}: {
    onSearch?: (filters: {
        location?: string;
        dateRange?: DateRange;
        guest: { adults: number; children: number; pets: number };
    }) => void;
}) {
    const [location, setLocation] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [guest, setGuest] = useState({
        adults: 1,
        children: 0,
        pets: 0,
    });
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);

    const uniqueLocations = useMemo(() => {
        const locs = plots.map((p) => p.location).filter(Boolean);
        return Array.from(new Set(locs)).sort();
    }, []);

    const handleGuestChange = (type: keyof typeof guest, delta: number) => {
        const newCount = guest[type] + delta;
        const minValue = type === "adults" ? 1 : 0;
        setGuest({ ...guest, [type]: Math.max(minValue, newCount) });
    };

    const handleSearch = () => {
        console.log("Searching with:", { location, dateRange, guest });
        if (onSearch) {
            onSearch({ location, dateRange, guest });
        }
        setIsMobileExpanded(false);
    };

    const guestSummary = useMemo(() => {
        const total = guest.adults + guest.children;
        if (total === 0) return "Add guests";
        let text = `${total} guest${total !== 1 ? "s" : ""}`;
        if (guest.pets > 0) text += `, ${guest.pets} pet${guest.pets !== 1 ? "s" : ""}`;
        return text;
    }, [guest]);

    const dateSummary = useMemo(() => {
        if (!dateRange?.from) return "Add dates";
        if (dateRange.to) {
            return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`;
        }
        return format(dateRange.from, "MMM dd");
    }, [dateRange]);

    const mobileSearchSummary = useMemo(() => {
        let text = "Start your trip";
        const totalGuests = guest.adults + guest.children + guest.pets;

        if (location && location !== "all") {
            text = `Trip to ${location}`;
            if (totalGuests > 1) {
                text += ` with ${totalGuests} guests`;
            }
        } else if (totalGuests > 1) {
            text = `Trip with ${totalGuests} guests`;
        }

        return text;
    }, [location, guest]);

    // Mobile Collapsed View
    if (!isMobileExpanded) {
        return (
            <>
                <div className="md:hidden w-full px-4">
                    <div
                        onClick={() => setIsMobileExpanded(true)}
                        className="flex items-center gap-4 bg-white rounded-full shadow-md border border-gray-200 p-3 pl-5 cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <Search className="h-5 w-5 text-black stroke-[2.5px]" />
                        <div className="flex flex-col">
                            <span className="text-md text-gray-900">{mobileSearchSummary}</span>
                        </div>
                    </div>
                </div>
                {/* Desktop View (Hidden on mobile) */}
                <DesktopView
                    location={location}
                    setLocation={setLocation}
                    uniqueLocations={uniqueLocations}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    dateSummary={dateSummary}
                    guest={guest}
                    guestSummary={guestSummary}
                    handleGuestChange={handleGuestChange}
                    handleSearch={handleSearch}
                />
            </>
        );
    }

    // Mobile Expanded View
    return (
        <div className="md:hidden w-full px-4 fixed inset-0 z-50 bg-white md:relative md:bg-transparent md:inset-auto md:z-auto md:p-0">
            <div className="h-full flex flex-col md:block md:h-auto">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-gray-100 -ml-2"
                        onClick={() => setIsMobileExpanded(false)}
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </Button>
                    <span className="font-semibold text-lg">Trip Planner</span>
                    <div className="w-10" /> {/* Spacer for centering title if needed */}
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* Where */}
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                            <Label className="text-lg font-bold text-gray-800">Where</Label>
                        </div>
                        <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-auto bg-transparent text-base text-gray-600 font-normal w-full text-left p-0">
                                <SelectValue placeholder="Search destinations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {uniqueLocations.map((loc) => (
                                    <SelectItem key={loc} value={loc}>
                                        {loc}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* When */}
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                            <Label className="text-lg font-bold text-gray-800">When</Label>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className={cn(
                                    "text-base font-normal truncate mt-1",
                                    dateRange?.from ? "text-gray-900" : "text-gray-500"
                                )}>
                                    {dateSummary}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={1}
                                    className="p-3"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Who */}
                    <div className="p-5">
                        <div className="flex justify-between items-center mb-1">
                            <Label className="text-lg font-bold text-gray-800">Who</Label>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className={cn(
                                    "text-base font-normal truncate mt-1",
                                    guest.adults + guest.children > 0 ? "text-gray-900" : "text-gray-500"
                                )}>
                                    {guestSummary}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[280px] p-4" align="start">
                                <div className="space-y-4">
                                    <GuestCounter
                                        label="Adults"
                                        description="Ages 13+"
                                        value={guest.adults}
                                        onDecrement={() => handleGuestChange("adults", -1)}
                                        onIncrement={() => handleGuestChange("adults", 1)}
                                        minValue={1}
                                    />
                                    <div className="border-t border-gray-100" />
                                    <GuestCounter
                                        label="Children"
                                        description="Ages 2-12"
                                        value={guest.children}
                                        onDecrement={() => handleGuestChange("children", -1)}
                                        onIncrement={() => handleGuestChange("children", 1)}
                                    />
                                    <div className="border-t border-gray-100" />
                                    <GuestCounter
                                        label="Pets"
                                        description="Service animal?"
                                        value={guest.pets}
                                        onDecrement={() => handleGuestChange("pets", -1)}
                                        onIncrement={() => handleGuestChange("pets", 1)}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Footer / Search Button */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <Button
                        onClick={handleSearch}
                        className="w-full h-12 rounded-xl bg-[#FF385C] hover:bg-[#D93B60] text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Search className="h-5 w-5 stroke-[2.5px]" />
                        Search
                    </Button>
                </div>
            </div>
            {/* Overlay to close when clicking outside could be added here preferably */}
            <div className="fixed inset-0 -z-10 md:hidden" onClick={() => setIsMobileExpanded(false)} />
        </div>
    );
}

// Extracted Desktop View to keep code clean and separate mobile logic
function DesktopView({
    location, setLocation, uniqueLocations,
    dateRange, setDateRange, dateSummary,
    guest, guestSummary, handleGuestChange, handleSearch
}: any) {
    return (
        <div className="hidden md:block w-full max-w-[850px] mx-auto font-sans">
            <div className="flex flex-row items-center bg-white rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.1)] border border-gray-200 p-0 divide-x divide-gray-200">

                {/* Where Section */}
                <div className="flex-1 relative group">
                    <div className="px-8 py-3.5 hover:bg-gray-100 rounded-full cursor-pointer transition-colors h-full flex flex-col justify-center">
                        <Label className="text-md font-bold text-gray-800 ml-1 cursor-pointer">Where</Label>
                        <div className="-ml-3">
                            <Select value={location} onValueChange={setLocation}>
                                <SelectTrigger className="border-0 shadow-none focus:ring-0 px-3 py-0 h-auto bg-transparent text-sm text-gray-600 font-normal w-full text-left truncate [&>span]:truncate">
                                    <SelectValue placeholder="Search destinations" className="placeholder:text-gray-900 text-md" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-xl border-gray-100 mt-2">
                                    <SelectItem value="all">All Locations</SelectItem>
                                    {uniqueLocations.map((loc: string) => (
                                        <SelectItem key={loc} value={loc}>
                                            {loc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* When Section */}
                <div className="flex-1 relative group">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="px-8 py-3.5 hover:bg-gray-100 rounded-full cursor-pointer transition-colors h-full flex flex-col justify-center text-left">
                                <Label className="text-md font-bold text-gray-800 ml-1 cursor-pointer">When</Label>
                                <div className={cn(
                                    "text-sm font-normal ml-1 truncate mt-0.5",
                                    dateRange?.from ? "text-gray-900" : "text-gray-500"
                                )}>
                                    {dateSummary}
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-gray-100 mt-2" align="center">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                className="p-3"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Who Section */}
                <div className="flex-1 relative group">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="px-8 py-3.5 hover:bg-gray-100 rounded-full cursor-pointer transition-colors h-full flex flex-col justify-center text-left pl-8">
                                <Label className="text-md font-bold text-gray-800 ml-1 cursor-pointer">Who</Label>
                                <div className={cn(
                                    "text-sm font-normal ml-1 truncate mt-0.5",
                                    guest.adults + guest.children > 0 ? "text-gray-900" : "text-gray-500"
                                )}>
                                    {guestSummary}
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-6 rounded-xl shadow-xl border-gray-100 mt-2 mr-4" align="end">
                            <div className="space-y-4">
                                <GuestCounter
                                    label="Adults"
                                    description="Ages 13 or above"
                                    value={guest.adults}
                                    onDecrement={() => handleGuestChange("adults", -1)}
                                    onIncrement={() => handleGuestChange("adults", 1)}
                                    minValue={1}
                                />
                                <div className="border-t border-gray-100" />
                                <GuestCounter
                                    label="Children"
                                    description="Ages 2-12"
                                    value={guest.children}
                                    onDecrement={() => handleGuestChange("children", -1)}
                                    onIncrement={() => handleGuestChange("children", 1)}
                                />
                                <div className="border-t border-gray-100" />
                                <GuestCounter
                                    label="Pets"
                                    description="Bringing a service animal?"
                                    value={guest.pets}
                                    onDecrement={() => handleGuestChange("pets", -1)}
                                    onIncrement={() => handleGuestChange("pets", 1)}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Search Button */}
                <div className="pr-2 pl-2">
                    <Button
                        onClick={handleSearch}
                        className="w-12 h-12 rounded-full bg-[#FF385C] hover:bg-[#D93B60] p-0 flex items-center justify-center shadow-md transition-all active:scale-95 group"
                    >
                        <Search className="h-5 w-5 text-white stroke-[2.5px]" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
