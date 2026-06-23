"use client";

import { useState } from "react";
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

interface ExperienceContactFormProps {
  phone?: string;
  email?: string;
  name?: string;
  slug: string;
}

export function ExperienceContactForm({
  phone = "9834069861",
  email = "advaitkulkarni301@gmail.com",
  name = "Konkan Dekho",
  slug,
}: ExperienceContactFormProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>();
  const [guest, setGuest] = useState({
    adults: 1,
    children: 0,
    pets: 0,
  });

  const handleDateChange = (selectedDate: Date | DateRange | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      return;
    }
    if (selectedDate instanceof Date) {
      setDate(selectedDate);
    } else if (selectedDate.from) {
      setDate(selectedDate.from);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast({
        title: "Incomplete Date",
        description: "Please select a date for the experience.",
        variant: "destructive",
      });
      return;
    }

    // Build the WhatsApp message
    const messageParts = [`*New Booking Inquiry for ${name} from Konkan Dekho*`];

    messageParts.push(`*Date:* ${format(date, "dd MMM yyyy")}`);

    // Add guest information to the message
    messageParts.push(`*Guests:*`);
    messageParts.push(`- Adults: ${guest.adults}`);
    if (guest.children > 0) {
      messageParts.push(`- Children: ${guest.children}`);
    }

    const whatsappMessage = messageParts.join("\n");
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/919588688856?text=${encodedMessage}`;

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

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">Book Experience</h2>
      <p className="mt-2 text-sm text-gray-600">
        Interested in this experience? Select a date and guests to inquire.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="flex gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Select Date
            </label>
            <DatePicker
              className="w-full"
              mode="single"
              date={date}
              onDateChange={handleDateChange}
              placeholder="Pick a date"
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
