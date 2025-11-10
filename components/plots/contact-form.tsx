"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Phone, Mail, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ContactFormProps {
  phone?: string;
  email?: string;
}

export function ContactForm({
  phone = "9834069861",
  email = "advaitkulkarni301@gmail.com",
}: ContactFormProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    pets: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGuestChange = (
    type: "adults" | "children" | "pets",
    value: number
  ) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Incomplete Dates",
        description: "Please select both a check-in and check-out date.",
        variant: "destructive",
      });
      return;
    }

    // Build the WhatsApp message
    const messageParts = ["*New Homestay Booking Inquiry from Konkan Dekho*"];

    if (formData.name.trim()) {
      messageParts.push(`*Name:* ${formData.name.trim()}`);
    }

    if (formData.email.trim()) {
      messageParts.push(`*Email:* ${formData.email.trim()}`);
    }

    if (formData.phoneNumber.trim()) {
      messageParts.push(`*Phone:* ${formData.phoneNumber.trim()}`);
    }

    if (dateRange?.from) {
      messageParts.push(
        `*Check-in Date:* ${format(dateRange.from, "dd MMM yyyy")}`
      );
    }

    if (dateRange?.to) {
      messageParts.push(
        `*Check-out Date:* ${format(dateRange.to, "dd MMM yyyy")}`
      );
    }

    messageParts.push(`*Guests:*`);
    messageParts.push(`  - Adults: ${guests.adults}`);
    messageParts.push(`  - Children: ${guests.children}`);
    messageParts.push(`  - Pets: ${guests.pets}`);

    if (formData.message.trim()) {
      messageParts.push(`*Message:* ${formData.message.trim()}`);
    }

    const whatsappMessage = messageParts.join("\n");
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/91${phone}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    toast({
      title: "Opening WhatsApp!",
      description: "Your message has been prepared and WhatsApp is opening.",
    });
  };

  const handlePhoneClick = () => {
    window.open(`tel:+91${phone}`, "_self");
  };

  const handleEmailClick = () => {
    window.open(`mailto:${email}`, "_self");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">Reserve Now</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <Input
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>
        <div>
          <Input
            type="tel"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in - Check-out Date
          </label>
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            placeholder="Select a date range"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guests
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-10 px-3"
              >
                {guests.adults > 0 && <span>{guests.adults} Adults</span>}
                {guests.children > 0 && (
                  <span>, {guests.children} Children</span>
                )}
                {guests.pets > 0 && <span>, {guests.pets} Pets</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Adults</p>
                    <p className="text-sm text-gray-500">Age 13+</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleGuestChange("adults", -1)}
                      disabled={guests.adults <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{guests.adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleGuestChange("adults", 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Children</p>
                    <p className="text-sm text-gray-500">Ages 2–12</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleGuestChange("children", -1)}
                      disabled={guests.children <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{guests.children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleGuestChange("children", 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pets</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleGuestChange("pets", -1)}
                      disabled={guests.pets <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{guests.pets}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleGuestChange("pets", 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Textarea
            placeholder="Your Message"
            className="min-h-[100px]"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#FF385C] hover:bg-[#D93B60]"
        >
          Reserve
        </Button>
      </form>

      <div className="mt-6 space-y-2">
        <button
          onClick={handlePhoneClick}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <Phone className="mr-2 h-4 w-4" />
          +91 {phone}
        </button>
        <button
          onClick={handleEmailClick}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <Mail className="mr-2 h-4 w-4" />
          {email}
        </button>
      </div>
    </Card>
  );
}
