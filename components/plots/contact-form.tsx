"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { GuestDropdown } from "@/components/ui/guest-dropdown";
import { Phone } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { sendGTMEvent } from "@/lib/gtm";

interface ContactFormProps {
  phone?: string;
  email?: string;
  name?: string;
  slug: string;
  icalUrls?: string[];
}

export function ContactForm({
  phone = "9834069861",
  email = "advaitkulkarni301@gmail.com",
  name = "Konkan Dekho",
  slug,
  icalUrls,
}: ContactFormProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [guest, setGuest] = useState({
    adults: 1,
    children: 0,
    pets: 0,
  });

  useEffect(() => {
    if (icalUrls && icalUrls.length > 0) {
      fetch('/api/ical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: icalUrls })
      })
        .then(res => res.json())
        .then(data => {
          if (data.dates) {
            setDisabledDates(data.dates.map((d: string) => new Date(d)));
          }
        })
        .catch(console.error);
    }
  }, [icalUrls]);

  const handleDateChange = (date: Date | DateRange | undefined) => {
    if (!date) {
      setDateRange(undefined);
      return;
    }
    if (date instanceof Date) {
      // normalize single Date to a DateRange (from === to)
      setDateRange({ from: date, to: date });
      return;
    }
    // date is already a DateRange
    setDateRange(date);
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
    const messageParts = [`*New Booking Inquiry for ${name} from Konkan Dekho*`];

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

    // Add guest information to the message
    messageParts.push(`*Guests:*`);
    messageParts.push(`- Adults: ${guest.adults}`);
    if (guest.children > 0) {
      messageParts.push(`- Children: ${guest.children}`);
    }
    if (guest.pets > 0) {
      messageParts.push(`- Pets: ${guest.pets}`);
    }

    const whatsappMessage = messageParts.join("\n");
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/91${phone}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    sendGTMEvent({
      event: "button_click",
      category: "Contact",
      action: "Send Message",
      label: slug,
    });

    toast({
      title: "Opening WhatsApp!",
      description: "Your message has been prepared and WhatsApp is opening.",
    });
  };

  const handlePhoneClick = () => {
    window.open(`tel:+91${phone}`, "_self");
    sendGTMEvent({
      event: "button_click",
      category: "Contact",
      action: "Call",
      label: slug,
    });
  };

  const handleEmailClick = () => {
    window.open(`mailto:${email}`, "_self");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">Reserve Now</h2>
      <p className="mt-2 text-sm text-gray-600">
        Interested in this homestay? Fill out the form below and we&apos;ll get
        back to you.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="flex gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Select Dates
            </label>
            <DatePicker
              className="w-full"
              mode="range"
              date={dateRange}
              onDateChange={handleDateChange}
              disabledDates={disabledDates}
              placeholder="Check-in - Check-out"
            />
          </div>
        </div>
        <div>
          <GuestDropdown guest={guest} setGuest={setGuest} />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#13b551ff] hover:bg-[#13b551dd]"
        >
          <WhatsappIcon className="mr-2 h-5 w-5" />
          Send Message
        </Button>
      </form>
      <div className="text-sm mt-4 text-gray-600">Or call directly on</div>
      <div className="mt-2 space-y-2">
        <button
          onClick={handlePhoneClick}
          className="flex items-center text-sm text-[#FF385C] hover:text-[#D93B60] transition-colors cursor-pointer"
        >
          <Phone className="mr-2 h-4 w-4" />
          +91 {phone}
        </button>
      </div>
    </Card>
  );
}
