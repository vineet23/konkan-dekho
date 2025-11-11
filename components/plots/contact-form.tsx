"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateRange || !dateRange.from || !dateRange.to) {
      toast({
        title: "Incomplete Date Range",
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
      <h2 className="text-xl font-semibold">Enquire Now</h2>
      <p className="mt-2 text-sm text-gray-600">
        Interested in this homestay? Fill out the form below and we&apos;ll get
        back to you.
      </p>
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
            Select Dates
          </label>
          <DatePicker
            mode="range"
            date={dateRange}
            onDateChange={setDateRange}
            placeholder="Check-in - Check-out"
          />
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
          Send Message
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
